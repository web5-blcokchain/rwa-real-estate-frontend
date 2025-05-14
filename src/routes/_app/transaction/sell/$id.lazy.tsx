import type { ConnectedWallet } from '@privy-io/react-auth'
import { sellAsset } from '@/api/investment'
import { IImage } from '@/components/common/i-image'
import { IInfoField } from '@/components/common/i-info-field'
import ISeparator from '@/components/common/i-separator'
import { PaymentMethod } from '@/components/common/payment-method'
import PropertyTokenABI from '@/contract/PropertyToken.json'
import TradingManagerABI from '@/contract/TradingManager.json'
import { useCommonDataStore } from '@/stores/common-data'
import { joinImagesPath } from '@/utils/url'
import { useWallets } from '@privy-io/react-auth'
import { useMutation } from '@tanstack/react-query'
import { createLazyFileRoute, useMatch, useNavigate, useRouter } from '@tanstack/react-router'
import { Button } from 'antd'
import { ethers } from 'ethers'
import numeral from 'numeral'

export const Route = createLazyFileRoute('/_app/transaction/sell/$id')({
  component: RouteComponent
})

function RouteComponent() {
  const { t } = useTranslation()
  const router = useRouter()
  const navigate = useNavigate()
  const { ready, wallets } = useWallets()
  const [wallet, setWallet] = useState<ConnectedWallet | null>(null)

  const { params } = useMatch({
    from: '/_app/transaction/sell/$id'
  })

  const id = Number.parseInt(params.id)
  const investmentItems = useCommonDataStore(state => state.investmentItems)

  const item = investmentItems.get(id)!

  const [tokens, setTokens] = useState(1)
  const [sellLoading, setSellLoading] = useState(false) // 新增loading状态

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async () => {
      const res = await sellAsset({
        id: `${item.id}`,
        token_number: `${tokens}`
      })
      return res.data
    }
  })

  useEffect(() => {
    if (item) {
      setTokens(item.token_number)
    }
  }, [item])

  async function sell() {
    if (!wallet) {
      toast.error(t('payment.errors.no_wallet'))
      return
    }

    setSellLoading(true) // 开始loading
    try {
      const ethProvider = await wallet.getEthereumProvider()
      const provider = new ethers.BrowserProvider(ethProvider)
      const signer = await provider.getSigner()

      const tradingManagerContract = new ethers.Contract(
        TradingManagerABI.address,
        TradingManagerABI.abi,
        signer
      )

      // 获取买单ID
      const orderId = BigInt(item.sell_order_id)
      if (!orderId) {
        toast.error(t('payment.errors.invalid_order_id'))
        return
      }

      // 获取买单信息
      let order
      try {
        order = await tradingManagerContract.getOrder(orderId)
        if (!order.active) {
          toast.error(t('payment.errors.order_not_active'))
          return
        }
      }
      catch (error) {
        console.error('获取买单信息失败:', error)
        toast.error(t('payment.errors.get_order_failed'))
        return
      }

      // 检查当前用户代币余额
      const propertyTokenAddress = order.token
      const propertyTokenContract = new ethers.Contract(
        propertyTokenAddress,
        PropertyTokenABI.abi,
        signer
      )
      const userAddress = await signer.getAddress()
      const tokenBalance = await propertyTokenContract.balanceOf(userAddress)

      console.log('用户代币余额:', tokenBalance)
      console.log('订单金额:', order.amount)

      if (tokenBalance < order.amount) {
        toast.error(t('payment.errors.insufficient_token'))
        return
      }

      // 检查代币授权额度
      const currentAllowance = await propertyTokenContract.allowance(userAddress, TradingManagerABI.address)
      if (currentAllowance < order.amount) {
        toast.info(t('payment.info.authorizing')) // 授权提示
        // 先清零授权
        await propertyTokenContract.approve(TradingManagerABI.address, 0)
        // 授权更大额度
        const approveAmount = order.amount * BigInt(2)
        await propertyTokenContract.approve(TradingManagerABI.address, approveAmount)
        // 再次检查
        const newAllowance = await propertyTokenContract.allowance(userAddress, TradingManagerABI.address)
        if (newAllowance < order.amount) {
          toast.error(t('payment.errors.token_approve_failed'))
          return
        }
      }

      // 显示交易处理中
      toast.info(t('payment.info.creating_transaction'))

      try {
        console.log('开始执行卖单交易...')
        // 执行卖单交易
        const sellOrderTx = await tradingManagerContract.sellOrder(orderId)
        const receipt = await sellOrderTx.wait()
        const hash = receipt.hash
        toast.success(t('payment.success.tx_sent')) // 成功提示

        // 调用后端API记录交易
        mutateAsync()
          .then(() => {
            navigate({
              to: '/transaction/$hash',
              params: {
                hash
              }
            })
          })
      }
      catch (contractError: any) {
        console.error('合约交易错误:', contractError)

        // 提取错误消息
        const errorMessage = contractError.message || ''

        // 尝试提取更详细的错误信息
        const innerErrorMatch = errorMessage.match(/reverted with reason string '(.+?)'/i)
        const innerError = innerErrorMatch ? innerErrorMatch[1] : ''

        if (innerError) {
          toast.error(t('payment.errors.contract_revert_with_reason', { reason: innerError }))
        }
        else if (errorMessage.includes('insufficient funds')) {
          toast.error(t('payment.errors.insufficient_eth'))
        }
        else if (errorMessage.includes('User denied')) {
          toast.error(t('payment.errors.rejected'))
        }
        else if (errorMessage.includes('execution reverted')) {
          toast.error(t('payment.errors.execution_reverted'))
        }
        else {
          toast.error(t('payment.errors.transaction_failed'))
        }
      }
    }
    catch (error) {
      console.error('Sell error:', error)

      if (error instanceof Error) {
        if (error.message.includes('rejected')) {
          toast.error(t('payment.errors.rejected'))
        }
        else {
          toast.error(t('payment.errors.general', { error: error.message }))
        }
      }
      else {
        toast.error(t('payment.errors.unknown'))
      }
    }
    finally {
      setSellLoading(false) // 结束loading
    }
  }

  useEffect(() => {
    if (ready) {
      const [firstWallet] = wallets
      if (firstWallet) {
        setWallet(firstWallet)
      }
    }

    if (!item) {
      toast.error(t('properties.payment.asset_not_found'))
      navigate({
        to: '/investment'
      })
    }
  }, [item, navigate, params, t, ready, wallets])

  if (!item) {
    return null
  }

  const [imageUrl] = joinImagesPath(item.image_urls)

  return (
    <div className="max-w-7xl p-8 space-y-8">
      <div className="text-center text-6 font-medium">{t('common.sell_title')}</div>

      <div className="flex gap-6 rounded-xl bg-[#202329] p-6">
        <div className="h-60 w-100">
          <IImage src={imageUrl} className="size-full rounded" />
        </div>
        <div>
          <div className="text-6 font-medium">{item?.name}</div>

          <div className="grid grid-cols-2 mt-4 gap-x-4">
            <IInfoField
              label={t('properties.detail.location')}
              value={item?.location}
              labelClass="text-[#898989]"
              className="space-y-2"
            />
            <IInfoField
              label={t('properties.detail.property_type')}
              value={item?.property_type}
              labelClass="text-[#898989]"
              className="space-y-2"
            />
            <IInfoField
              label={t('properties.payment.token_price')}
              value={`${numeral(item?.total_amount).format('0,0')} / token`}
              labelClass="text-[#898989]"
              className="space-y-2"
            />
            <IInfoField
              label={t('properties.payment.total')}
              value={numeral(Number(item?.total_amount) * item.tokens_held).format('0,0')}
              labelClass="text-[#898989]"
              className="space-y-2"
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-[#202329] p-6 space-y-4">
        <div className="text-4.5">{t('properties.payment.payment_details')}</div>

        <div className="flex items-center justify-between text-4">
          <div className="text-[#898989] space-y-4">
            <div>{t('properties.payment.tokens_held')}</div>
            <div>{t('properties.payment.number')}</div>
            <div>{t('properties.payment.subtotal')}</div>
            <div>
              {t('properties.payment.platform_fee')}
              {' '}
              (2%)
            </div>
          </div>

          <div className="space-y-4">
            <div className="text-right text-[#898989]">{item.tokens_held}</div>
            <div className="flex justify-end">
              {item.token_number}
            </div>

            <div className="text-right">
              $
              {tokens * Number(item.token_price)}
            </div>
            <div className="text-right">
              $
              {tokens * Number(item.token_price) * 0.02}
            </div>
          </div>
        </div>

        <ISeparator className="bg-white" />

        <div className="fbc">
          <div>{t('properties.payment.total_amount')}</div>
          <div className="text-primary">
            {`$${(tokens * Number(item.token_price)) - (tokens * Number(item.token_price) * 0.02)}`}
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-[#202329] p-6 space-y-4">
        <div className="text-4.5">{t('properties.payment.payment_method')}</div>
        <PaymentMethod walletState={[wallet, setWallet]} />
      </div>

      <div className="rounded-xl bg-[#202329] p-6 text-4 text-[#898989] space-y-2">
        <p>{t('properties.payment.dear_user')}</p>
        <p>
          {t('properties.payment.please_verify')}

        </p>
        <p>
          {t('properties.payment.please_verify_1')}

          Your account must be fully verified with a valid government-issued ID or passport.
        </p>
      </div>

      <div>
        <div className="grid grid-cols-3 mt-2">
          <div>
            <Button
              className="text-white bg-transparent!"
              size="large"
              onClick={() => router.history.back()}
            >
              {t('system.cancel')}
            </Button>
          </div>
          <div className="fcc">
            <Button
              type="primary"
              size="large"
              className="w-48 disabled:bg-gray-2 text-black!"
              onClick={sell}
              loading={isPending || sellLoading}
              disabled={isPending || sellLoading}
            >
              {t('action.confirm_sell')}
            </Button>
          </div>
          <div></div>
        </div>
      </div>
    </div>
  )
}
