import type { ConnectedWallet } from '@privy-io/react-auth'
import { sellOrder } from '@/api/investment'
import { IImage } from '@/components/common/i-image'
import { IInfoField } from '@/components/common/i-info-field'
import ISeparator from '@/components/common/i-separator'
import { PaymentContent } from '@/components/common/payment-content'
import { useCommonDataStore } from '@/stores/common-data'
import { useUserStore } from '@/stores/user'
import { formatNumberNoRound, toBigNumer } from '@/utils/number'
import { joinImagesPath } from '@/utils/url'
import { getPropertyTokenAmount } from '@/utils/web/propertyToken'
import { getTradeContract, tradeContractSellOrder } from '@/utils/web/tradeContract'
import { useMutation } from '@tanstack/react-query'
import { createLazyFileRoute, useMatch, useNavigate, useRouter } from '@tanstack/react-router'
import { Button } from 'antd'
import { PayDialog } from '../../properties/-components/payDialog'

export const Route = createLazyFileRoute('/_app/transaction/sell/$id')({
  component: RouteComponent
})

function RouteComponent() {
  const { t } = useTranslation()
  const router = useRouter()
  const navigate = useNavigate()
  const [wallet, setWallet] = useState<ConnectedWallet | null>(null)

  const { params } = useMatch({
    from: '/_app/transaction/sell/$id'
  })

  const id = Number.parseInt(params.id)
  const commonData = useCommonDataStore()
  const { investmentItems } = commonData
  const item = investmentItems.get(id)!

  const [tokens, setTokens] = useState(1)
  const [sellLoading, setSellLoading] = useState(false) // 新增loading状态
  const [payDialogOpen, setPayDialogOpen] = useState(false)

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (hash: string) => {
      const res = await sellOrder({
        order_market_id: `${item.id}`,
        token_number: `${tokens}`,
        hash
      })
      return res.data
    }
  })

  useEffect(() => {
    if (item) {
      setTokens(item.token_number)
    }
  }, [item])

  // 获取当前用户持有代币
  const [userToken, setUserToken] = useState(-1)
  const getUserToken = async () => {
    if (!wallet || !item?.contract_address)
      return
    const ethProvider = await wallet.getEthereumProvider()
    const userToken = await getPropertyTokenAmount(ethProvider, item.contract_address, wallet.address)
    setUserToken(userToken)
  }
  useEffect(() => {
    getUserToken()
  }, [wallet, item])

  const userData = useUserStore(state => state.userData)
  // 卖出代币
  async function sell() {
    if (!wallet) {
      toast.error(t('payment.errors.no_wallet'))
      return
    }
    // 验证是自己绑定的钱包自己的钱包
    if (wallet.address !== userData.wallet_address) {
      toast.warn(t('payment.errors.please_use_bound_wallet'))
      return
    }

    setSellLoading(true) // 开始loading
    try {
      const ethProvider = await wallet.getEthereumProvider()
      const tradingManagerContract = await getTradeContract(ethProvider)

      // 检查当前用户代币余额
      const tokenBalance = await getPropertyTokenAmount(ethProvider, item.contract_address, wallet.address)
      const sellPrice = tokens * Number(item.token_price)

      console.log('用户代币余额:', tokenBalance)
      console.log('订单金额:', sellPrice)

      if (tokenBalance < sellPrice) {
        toast.error(t('payment.errors.insufficient_token'))
        return
      }

      // 显示交易处理中
      toast.info(t('payment.info.creating_transaction'))

      try {
        console.log('开始执行卖单交易...')
        setPayDialogOpen(true)
        // 执行卖单交易
        const sellOrderTx = await tradeContractSellOrder(tradingManagerContract, ethProvider, {
          token: item.contract_address,
          sellOrderId: Number(item.sell_order_id),
          amount: tokens,
          price: Number(item.token_price)
        })
        const receipt = await sellOrderTx.wait()
        console.log('receipt', receipt)
        toast.success(t('payment.success.tx_sent')) // 成功提示

        // 调用后端API记录交易
        mutateAsync(sellOrderTx.hash)
          .then(() => {
            navigate({
              to: '/investment'
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
      setPayDialogOpen(false)
    }
  }

  useEffect(() => {
    if (!item) {
      // toast.error(t('properties.payment.asset_not_found'))
      navigate({
        to: '/investment'
      })
    }
  }, [item, navigate, params, t])

  if (!item) {
    return null
  }

  const [imageUrl] = joinImagesPath(item.image_urls)

  return (
    <div className="mx-auto max-w-7xl p-8 space-y-8 max-lg:p-4">
      <div className="text-center text-6 font-medium">{t('common.sell_title')}</div>

      <div className="flex gap-6 rounded-xl bg-[#202329] p-6 max-lg:flex-col">
        <div className="h-60 w-100 max-lg:h-auto max-lg:w-full">
          <IImage src={imageUrl} className="size-full rounded" />
        </div>
        <div className="flex-1">
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
              value={`${formatNumberNoRound(item?.token_price, 8)} ${commonData.payTokenName}`}
              labelClass="text-[#898989]"
              className="space-y-2"
            />
            <IInfoField
              label={t('properties.payment.total')}
              value={`${formatNumberNoRound(item?.total_amount, 8)} ${commonData.payTokenName}`}
              labelClass="text-[#898989]"
              className="space-y-2"
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-[#202329] p-6 space-y-4">
        <div className="text-4.5">{t('properties.payment.payment_details')}</div>

        <div className="flex items-center justify-between text-4">
          <div className="w-full text-[#898989] [&>div]:w-full [&>div]:fyc [&>div]:justify-between space-y-4">
            <div>
              <div>{t('properties.payment.tokens_held')}</div>
              <div className="text-right text-[#898989]">
                {t('profile.warning.redemption.redemption_num', { num: userToken >= 0 ? formatNumberNoRound(userToken, 8) : '-' })}
              </div>
            </div>
            <div>
              <div>{t('properties.payment.number')}</div>
              <div className="flex justify-end">
                {t('profile.warning.redemption.redemption_num', { num: formatNumberNoRound(item.token_number, 8) })}
              </div>
            </div>
            <div>
              <div>{t('properties.payment.subtotal')}</div>
              <div className="text-right">
                {formatNumberNoRound((toBigNumer(tokens).multipliedBy(item.token_price)).toString(), 8)}
                {' '}
                {commonData.payTokenName}
              </div>
            </div>
            <div>
              {/* <div>
                {t('properties.payment.platform_fee')}
                {' '}
                (2%)
              </div>
              <div className="text-right">
                $
                {tokens * Number(item.token_price) * 0.02}
              </div> */}
            </div>
          </div>

          <div className="space-y-4">
          </div>
        </div>

        <ISeparator className="bg-white" />

        <div className="fbc">
          <div>{t('properties.payment.total_amount')}</div>
          <div className="text-primary">
            {`${formatNumberNoRound((tokens * Number(item.token_price)), 8)} ${commonData.payTokenName}`}
          </div>
        </div>
      </div>

      <PaymentContent walletState={[wallet, setWallet]} />

      <div>
        <div className="mt-2 fcc gap-4">
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
      <PayDialog open={payDialogOpen} onClose={() => setPayDialogOpen(false)} />
    </div>
  )
}
