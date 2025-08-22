import type { ConnectedWallet } from '@privy-io/react-auth'
import { buyAsset } from '@/api/investment'
import { IImage } from '@/components/common/i-image'
import { IInfoField } from '@/components/common/i-info-field'
import ISeparator from '@/components/common/i-separator'
import { PaymentContent } from '@/components/common/payment-content'
import QuantitySelector from '@/components/common/quantity-selector'
import { useCommonDataStore } from '@/stores/common-data'
import { useUserStore } from '@/stores/user'
import { formatNumberNoRound, toBigNumer } from '@/utils/number'
import { joinImagesPath } from '@/utils/url'
import { getTradeContract, tradeContractBuyOrder } from '@/utils/web/tradeContract'
import { getUsdcContract } from '@/utils/web/usdcAddress'
import { toPlainString18 } from '@/utils/web/utils'
import { useMutation } from '@tanstack/react-query'
import { createLazyFileRoute, useMatch, useNavigate, useRouter } from '@tanstack/react-router'
import { Button } from 'antd'
import { ethers } from 'ethers'
import { PayDialog } from '../../properties/-components/payDialog'

export const Route = createLazyFileRoute('/_app/transaction/buy/$id')({
  component: RouteComponent
})

function RouteComponent() {
  const { t } = useTranslation()
  const router = useRouter()
  const navigate = useNavigate()
  const [wallet, setWallet] = useState<ConnectedWallet | null>(null)

  const { params } = useMatch({
    from: '/_app/transaction/buy/$id'
  })

  const id = Number.parseInt(params.id)
  const investmentItems = useCommonDataStore(state => state.investmentItems)
  const item = investmentItems.get(id)!

  const [tokens, setTokens] = useState(1)
  const [buyLoading, setBuyLoading] = useState(false) // 新增loading状态

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (data: {
      order_market_id: string
      token_number: string
      hash: string
    }) => {
      const res = await buyAsset(data)
      return res.data
    }
  })

  const [payDialogOpen, setPayDialogOpen] = useState(false)
  const userData = useUserStore(state => state.userData)
  async function buy() {
    if (!wallet) {
      toast.error(t('payment.errors.no_wallet'))
      return
    }
    // 验证是自己绑定的钱包自己的钱包
    if (wallet.address !== userData.wallet_address) {
      toast.warn(t('payment.errors.please_use_bound_wallet'))
      return
    }
    if (userData.audit_status !== 4) { // 判断当前用户是否是绑定的钱包/已经审核通过链
      toast.error(t('payment.errors.please_wait_for_kyc'))
      return
    }

    setBuyLoading(true) // 开始loading
    try {
      const ethProvider = await wallet.getEthereumProvider()
      const usdtContract = await getUsdcContract(ethProvider)
      const tradingManagerContract = await getTradeContract(ethProvider)
      const orderId = Number(item.sell_order_id)
      console.log('orderId', orderId)

      // 买单交易流程
      const payAmount = Number(tokens)
      const token_price = Number(item.token_price)
      // 获取订单信息
      const usdcDecimals = await usdtContract.decimals()
      const requiredUsdt = ethers.parseUnits(toPlainString18(payAmount * token_price), usdcDecimals)
      const usdtBalance = await usdtContract.balanceOf(wallet.address)
      if (usdtBalance < requiredUsdt) {
        toast.error(t('payment.errors.insufficient_usdt'))
        console.log(`USDT余额不足，需要 ${ethers.formatUnits(requiredUsdt, usdcDecimals)}，实际有 ${ethers.formatUnits(usdtBalance, usdcDecimals)}`)
        return
      }
      setPayDialogOpen(true)
      // 执行买单
      console.log(`准备执行买单，订单ID: ${orderId}`)
      const [tx] = await Promise.all([
        // listenerOrderExecutedEvent(wallet.address,item.contract_address,true),
        tradeContractBuyOrder(tradingManagerContract, ethProvider, {
          sellOrderId: orderId,
          amount: payAmount,
          price: token_price
        })
      ])
      console.log(`买单交易已发送，等待确认...`)
      const receipt = await tx.wait()
      console.log(`买单执行成功，交易哈希: ${receipt?.hash}`)
      // 调用后端API记录购买信息
      await mutateAsync({
        order_market_id: item.id.toString(),
        token_number: payAmount.toString(),
        hash: tx.hash
      })
      toast.success(t('payment.success.tx_sent')) // 成功提示
      navigate({
        to: '/investment'
      })
    }
    catch (error: any) {
      console.error(`执行买单失败:`, error)
      if (error.code === 'ACTION_REJECTED' || error.code === 4001) {
        toast.error(t('payment.errors.rejected'))
      }
      else if (error.message && error.message.includes('rejected')) {
        toast.error(t('payment.errors.rejected'))
      }
      else if (error.message && error.message.includes('insufficient funds')) {
        toast.error(t('payment.errors.insufficient_eth'))
      }
      else {
        toast.error(t('payment.errors.transaction_failed'))
      }
      throw error
    }
    finally {
      setBuyLoading(false) // 结束loading
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
    else {
      setTokens(item.token_number)
    }
  }, [item, navigate, params, t])

  if (!item) {
    return null
  }

  const [imageUrl] = joinImagesPath(item.image_urls)

  return (
    <div className="mx-auto max-w-7xl p-8 space-y-8">
      <div className="text-center text-6 font-medium">{t('common.payment_title')}</div>

      <div className="flex gap-6 rounded-xl bg-[#202329] p-6">
        <div className="h-60 w-100">
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
              value={`$${formatNumberNoRound(item?.token_price, 8)}`}
              labelClass="text-[#898989]"
              className="space-y-2"
            />
            <IInfoField
              label={t('properties.payment.total')}
              value={`$${formatNumberNoRound(item.total_amount, 8)}`}
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
            {/* <div>
              {t('properties.payment.platform_fee')}
              {' '}
              (2%)
            </div> */}
          </div>

          <div className="space-y-4">
            <div className="flex justify-end">
              <QuantitySelector
                value={tokens}
                onChange={setTokens}
                min={1}
                max={item?.token_number}
                disabled
              />
            </div>

            <div className="text-right">
              $
              {formatNumberNoRound((toBigNumer(tokens).multipliedBy(item.token_price)).toString(), 8)}
            </div>
            {/* <div className="text-right">
              $
              {tokens * Number(item.token_price) * 0.02}
            </div> */}
          </div>
        </div>

        <ISeparator className="bg-white" />

        <div className="fbc">
          <div>{t('properties.payment.total_amount')}</div>
          <div className="text-primary">
            $
            {formatNumberNoRound((toBigNumer(tokens).multipliedBy(item.token_price)).toString(), 8)}
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
              onClick={buy}
              loading={isPending || buyLoading}
              disabled={isPending || buyLoading}
            >
              {t('properties.payment.confirm_payment')}
            </Button>
          </div>
          <div></div>
        </div>
      </div>
      <PayDialog open={payDialogOpen} onClose={() => setPayDialogOpen(false)} />
    </div>
  )
}
