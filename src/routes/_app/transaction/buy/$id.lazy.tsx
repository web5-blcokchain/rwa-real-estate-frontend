import type { ConnectedWallet } from '@privy-io/react-auth'
import { buyAsset } from '@/api/investment'
import { IImage } from '@/components/common/i-image'
import { IInfoField } from '@/components/common/i-info-field'
import ISeparator from '@/components/common/i-separator'
import { PaymentMethod } from '@/components/common/payment-method'
import QuantitySelector from '@/components/common/quantity-selector'
import SimpleERC20ABI from '@/contract/SimpleERC20.json'
import TradingManagerABI from '@/contract/TradingManager.json'
import { useCommonDataStore } from '@/stores/common-data'
import { joinImagesPath } from '@/utils/url'
import { useWallets } from '@privy-io/react-auth'
import { useMutation } from '@tanstack/react-query'
import { createLazyFileRoute, useMatch, useNavigate, useRouter } from '@tanstack/react-router'
import { Button } from 'antd'
import { ethers } from 'ethers'

export const Route = createLazyFileRoute('/_app/transaction/buy/$id')({
  component: RouteComponent
})

function RouteComponent() {
  const { t } = useTranslation()
  const router = useRouter()
  const navigate = useNavigate()
  const { ready, wallets } = useWallets()
  const [wallet, setWallet] = useState<ConnectedWallet | null>(null)

  const { params } = useMatch({
    from: '/_app/transaction/buy/$id'
  })

  const id = Number.parseInt(params.id)
  const investmentItems = useCommonDataStore(state => state.investmentItems)
  const item = investmentItems.get(id)!

  const [tokens, setTokens] = useState(1)

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async () => {
      const res = await buyAsset({ order_id: item.id })
      return res.data
    }
  })

  async function buy() {
    if (!wallet) {
      toast.error(t('payment.errors.no_wallet'))
      return
    }

    const ethProvider = await wallet.getEthereumProvider()
    const provider = new ethers.BrowserProvider(ethProvider)
    const signer = await provider.getSigner()

    const usdtContract = new ethers.Contract(
      SimpleERC20ABI.address,
      SimpleERC20ABI.abi,
      signer
    )

    const tradingManagerContract = new ethers.Contract(
      TradingManagerABI.address,
      TradingManagerABI.abi,
      signer
    )

    const orderId = BigInt(item.sell_order_id)

    console.log('orderId', orderId)

    // 买单交易流程
    try {
      // 获取订单信息
      const order = await tradingManagerContract.getOrder(orderId)

      const orderAmount = BigInt(Number(ethers.formatUnits(order.amount, 18)))
      const orderPrice = BigInt(Number(order.price))

      console.log(`卖单信息:
          - 卖家: ${order.seller}
          - 代币: ${order.token}
          - 数量: ${orderAmount}
          - 价格: ${orderPrice}
          - 是否活跃: ${order.active}
      `)

      // 计算需要的USDT数量
      const requiredUsdt = orderAmount * orderPrice
      console.log(`需要的USDT数量: ${ethers.formatUnits(requiredUsdt, 18)}`)

      // 检查USDT余额
      const investorAddress = wallet.address
      const usdtBalance = await usdtContract.balanceOf(investorAddress)
      console.log(`当前USDT余额: ${ethers.formatUnits(usdtBalance, 18)}`)

      if (usdtBalance < requiredUsdt) {
        throw new Error(`USDT余额不足，需要 ${ethers.formatUnits(requiredUsdt, 18)}，实际有 ${ethers.formatUnits(usdtBalance, 18)}`)
      }

      // 检查USDT授权额度
      const currentAllowance = await usdtContract.allowance(investorAddress, TradingManagerABI.address)
      console.log(`当前USDT授权额度: ${ethers.formatUnits(currentAllowance, 18)}`)

      // 如果授权额度不足，进行授权
      if (currentAllowance < requiredUsdt) {
        console.log(`USDT授权额度不足，正在授权...`)
        // 授权一个非常大的额度，避免后续交易再次授权
        const approveAmount = requiredUsdt * BigInt(10)

        // 先清零授权
        console.log(`清零当前授权...`)
        const resetTx = await usdtContract.approve(TradingManagerABI.address, 0)
        await resetTx.wait()

        // 设置新的授权额度
        console.log(`设置新的授权额度: ${ethers.formatUnits(approveAmount, 18)} USDT`)
        const approveTx = await usdtContract.approve(TradingManagerABI.address, approveAmount)
        await approveTx.wait()

        // 再次检查授权额度
        const newAllowance = await usdtContract.allowance(investorAddress, TradingManagerABI.address)
        console.log(`新的USDT授权额度: ${ethers.formatUnits(newAllowance, 18)}`)

        if (newAllowance < requiredUsdt) {
          throw new Error(`USDT授权失败，当前授权额度 ${ethers.formatUnits(newAllowance, 18)} 小于需要的 ${ethers.formatUnits(requiredUsdt, 18)}`)
        }
      }

      // 执行买单
      console.log(`准备执行买单，订单ID: ${orderId}`)
      const tx = await tradingManagerContract.buyOrder(orderId)
      console.log(`买单交易已发送，等待确认...`)
      const receipt = await tx.wait()
      console.log(`买单执行成功，交易哈希: ${receipt.hash}`)

      // 获取最新的订单信息
      const updatedOrder = await tradingManagerContract.getOrder(orderId)
      console.log(`交易完成后订单信息:`, updatedOrder)

      // 调用后端API记录购买信息
      return await mutateAsync()
    }
    catch (error) {
      console.error(`执行买单失败:`, error)
      throw error
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
      <div className="text-center text-6 font-medium">{t('common.payment_title')}</div>

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
              value={item?.total_amount}
              labelClass="text-[#898989]"
              className="space-y-2"
            />
            <IInfoField
              label={t('properties.payment.total')}
              value={item.total_amount}
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
            <div>{t('properties.payment.number')}</div>
            <div>{t('properties.payment.subtotal')}</div>
            <div>
              {t('properties.payment.platform_fee')}
              {' '}
              (2%)
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-end">
              <QuantitySelector
                value={tokens}
                onChange={setTokens}
                min={1}
                max={100}
                disabled={isPending}
              />
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
            {`$${(tokens * Number(item.token_price)) + (tokens * Number(item.token_price) * 0.02)}`}
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
              onClick={buy}
              loading={isPending}
              disabled={isPending}
            >
              {t('properties.payment.confirm_payment')}
            </Button>
          </div>
          <div></div>
        </div>
      </div>
    </div>
  )
}
