import type { ConnectedWallet } from '@privy-io/react-auth'
import { sellAsset } from '@/api/investment'
import { IImage } from '@/components/common/i-image'
import { IInfoField } from '@/components/common/i-info-field'
import ISeparator from '@/components/common/i-separator'
import { PaymentContent } from '@/components/common/payment-content'
import QuantitySelector from '@/components/common/quantity-selector'
import { useCommonDataStore } from '@/stores/common-data'
import { useUserStore } from '@/stores/user'
import { formatNumberNoRound, toBigNumer } from '@/utils/number'
import { joinImagesPath } from '@/utils/url'
import { getPropertyTokenAmount } from '@/utils/web/propertyToken'
import { createSellOrder, getTradeContract, listenerCreateSellEvent } from '@/utils/web/tradeContract'
import { getContactInfo } from '@/utils/web/usdcAddress'
import { toPlainString18 } from '@/utils/web/utils'
import { useMutation } from '@tanstack/react-query'
import { createLazyFileRoute, useMatch, useNavigate, useRouter } from '@tanstack/react-router'
import { Button, InputNumber } from 'antd'
import { PayDialog } from '../../properties/-components/payDialog'

export const Route = createLazyFileRoute('/_app/transaction/create-sell-order/$id')({
  component: RouteComponent
})

function RouteComponent() {
  const { t } = useTranslation()
  const router = useRouter()
  const navigate = useNavigate()
  const [wallet, setWallet] = useState<ConnectedWallet | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const { params } = useMatch({
    from: '/_app/transaction/create-sell-order/$id'
  })

  const id = Number.parseInt(params.id)
  const investmentItems = useCommonDataStore(state => state.investmentItems)

  const item = investmentItems.get(id)!

  const [tokens, setTokens] = useState(1)
  const [sellPrice, setsellPrice] = useState(1)
  const [usdcInfo, setUsdcInfo] = useState({
    decimals: 6,
    symbol: 'USDT'
  })
  const maxPrice = 999999999999999

  const { isPending, mutateAsync } = useMutation({
    mutationFn: async (data: {
      token_number: string
      sell_order_id: string
      hash: string
      price: string
    }) => {
      const res = await sellAsset({
        ...data,
        id: item.id.toString()
      })
      return res.data
    }
  })

  // 获取当前用户持有代币
  const [userToken, setUserToken] = useState(-1)
  const getUserToken = async () => {
    if (!wallet || !item?.contract_address)
      return
    const ethProvider = await wallet.getEthereumProvider()
    const userToken = await getPropertyTokenAmount(ethProvider, item.contract_address, wallet.address)
    // 获取代币精度
    const { decimals, symbol } = await getContactInfo(ethProvider)
    setUsdcInfo({
      decimals: Number(decimals),
      symbol
    })
    setUserToken(userToken)
  }
  useEffect(() => {
    getUserToken()
  }, [wallet, item])

  const [payDialogOpen, setPayDialogOpen] = useState(false)
  const userData = useUserStore(state => state.userData)
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
    if (userData.audit_status !== 4) { // 判断当前用户是否是绑定的钱包/已经审核通过链
      toast.error(t('payment.errors.please_wait_for_kyc'))
      return
    }
    if (sellPrice < (1 * 10 ** (-1 * usdcInfo.decimals)))
      return

    setIsProcessing(true)

    console.log(wallet)

    // item.contract_address = '0xa0FA9cfEC8B6F8E0C3C7edBbBA3Ae5237FF6D4f3'
    // ;(item as any).id = 'PROP-1746803801088'
    // wallet.address = '0xA5922D51BfD5b9381f1FF32418FddFdE35582cAC'

    try {
      const ethProvider = await wallet.getEthereumProvider()
      // const propertyTokenContract = await getPropertyTokenContract(ethProvider, item.contract_address)
      const tradingContact = await getTradeContract(ethProvider)

      try {
        // 检查余额（链上余额）
        // const tokenDecimals = await propertyTokenContract.decimals()
        const operatorTokenBalance = await getPropertyTokenAmount(ethProvider, item.contract_address, wallet.address)
        const tokenAmount = tokens
        console.log(`操作者代币余额: ${operatorTokenBalance} 个代币`)
        if (operatorTokenBalance < tokenAmount) {
          toast.error(
            t('payment.errors.insufficient_token')
          )
          setIsProcessing(false)
          return
        }
        setPayDialogOpen(true)
        // 创建卖单
        toast.info(t('payment.messages.creating_buy_order'))
        try {
          const [orderId, createData] = await Promise.all([
            listenerCreateSellEvent(wallet.address, item.contract_address, true),
            createSellOrder(tradingContact, ethProvider, {
              token: item.contract_address,
              amount: tokenAmount,
              price: sellPrice
            })
          ])
          const { tx, price } = createData
          console.log(`交易已发送: ${tx.hash}`)
          console.log('tx', tx)
          toast.success(t('payment.success.tx_sent'))
          const receipt = await tx.wait()
          console.log('交易已确认', receipt)
          // 10. 记录交易
          await mutateAsync({
            token_number: tokenAmount.toString(),
            sell_order_id: orderId.toString(),
            hash: tx.hash,
            price: toPlainString18(price)
          })
          toast.success(t('payment.messages.sell_order_created'))

          // 11. 返回上一页
          setTimeout(() => {
            router.history.back()
          }, 2000)
        }
        catch (error: any) {
          console.error('创建卖单失败:', error)

          // 更详细地记录错误信息
          console.error('错误详情:', JSON.stringify({
            code: error.code,
            message: error.message,
            data: error.data,
            reason: error.reason,
            stack: error.stack
          }, null, 2))
          if (error.message === '3002') {
            toast.error(t('payment.errors.network_connection'))
            return
          }
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

          setIsProcessing(false)
        }
      }
      catch (error: any) {
        console.error('获取钱包失败:', error)
        toast.error(
          t('payment.errors.general', { error: error.message || t('payment.errors.unknown') })
        )
        setIsProcessing(false)
        setPayDialogOpen(false)
      }
    }
    catch (error: any) {
      console.error('交易过程中出现错误:', error)
      toast.error(
        t('payment.errors.general', { error: error.message || t('payment.errors.unknown') })
      )
      setIsProcessing(false)
      setPayDialogOpen(false)
    }
    finally {
      setIsProcessing(false)
      setPayDialogOpen(false)
    }
  }

  useEffect(() => {
    if (!item) {
      // toast.error(t('properties.payment.asset_not_found'))
      navigate({
        to: '/profile'
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
              value={`${formatNumberNoRound(Number(item?.token_price), 8)} / token`}
              labelClass="text-[#898989]"
              className="space-y-2"
            />
            <IInfoField
              label={t('properties.payment.total')}
              value={`$${formatNumberNoRound(toBigNumer(Number(item?.total_amount)).multipliedBy(item.token_price).toString(), 8)}`}
              labelClass="text-[#898989]"
              className="space-y-2"
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-[#202329] p-6 space-y-4">
        <div className="text-4.5">{t('transaction.sell.detail')}</div>

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
                <QuantitySelector
                  value={tokens}
                  onChange={setTokens}
                  min={1}
                  max={userToken || item.tokens_held}
                  disabled={isPending || isProcessing}
                />
              </div>
            </div>
            <div>
              <div>{t('properties.payment.token_price')}</div>
              <div className="fcc gap-2">
                <InputNumber
                  formatter={value => `${toBigNumer(value || 0).toString()}`}
                  parser={value => Number(value || 0)}
                  precision={usdcInfo.decimals}
                  className="[&>div>*]:!text-center"
                  controls={false}
                  value={sellPrice}
                  onChange={value => setsellPrice(value || 1)}
                  min={1 * 10 ** (-1 * usdcInfo.decimals)}
                  max={maxPrice}
                />
                <div>{usdcInfo.symbol}</div>
              </div>
            </div>
            <div>
              <div>{t('properties.payment.subtotal')}</div>
              <div className="text-right">
                $
                {formatNumberNoRound((toBigNumer(tokens).multipliedBy(sellPrice)).toString(), 8)}
              </div>
            </div>

          </div>

          <div className="space-y-4">

          </div>
        </div>

        <ISeparator className="bg-white" />

        <div className="fbc">
          <div>{t('properties.payment.total_amount')}</div>
          <div className="text-primary">
            $
            {formatNumberNoRound((toBigNumer(tokens).multipliedBy(sellPrice)).toString(), 8)}
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
              loading={isProcessing}
              disabled={isPending || isProcessing || userToken <= 0}
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
