import type { ConnectedWallet } from '@privy-io/react-auth'
import { sellAsset } from '@/api/investment'
import { IImage } from '@/components/common/i-image'
import { IInfoField } from '@/components/common/i-info-field'
import ISeparator from '@/components/common/i-separator'
import { PaymentMethod } from '@/components/common/payment-method'
import QuantitySelector from '@/components/common/quantity-selector'
import { usePropertyTokenContract, useTradingManagerContract } from '@/contract'
import { address as TradingManagerAddress } from '@/contract/TradingManager.json'
import { useCommonDataStore } from '@/stores/common-data'
import { joinImagesPath } from '@/utils/url'
import { useWallets } from '@privy-io/react-auth'
import { useMutation } from '@tanstack/react-query'
import { createLazyFileRoute, useMatch, useNavigate, useRouter } from '@tanstack/react-router'
import { Button } from 'antd'
import numeral from 'numeral'

export const Route = createLazyFileRoute('/_app/transaction/create-sell-order/$id')({
  component: RouteComponent
})

function RouteComponent() {
  const { t } = useTranslation()
  const router = useRouter()
  const navigate = useNavigate()
  const { ready, wallets } = useWallets()
  const [wallet, setWallet] = useState<ConnectedWallet | null>(null)
  const [isApproving, setIsApproving] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const { params } = useMatch({
    from: '/_app/transaction/create-sell-order/$id'
  })

  const id = Number.parseInt(params.id)
  const investmentItems = useCommonDataStore(state => state.investmentItems)

  const item = investmentItems.get(id)!

  const tradingManagerContract = useTradingManagerContract()

  const [tokens, setTokens] = useState(1)

  const { isPending, mutate } = useMutation({
    mutationFn: async (hash: string) => {
      const res = await sellAsset({
        order_market_id: item.id,
        hash
      })
      return res.data
    }
  })

  async function sell() {
    if (!wallet) {
      toast.error(t('payment.errors.no_wallet'))
      return
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const propertyTokenContract = usePropertyTokenContract(item.contract_address)!

    if (!propertyTokenContract) {
      toast.error(t('payment.errors.property_token_not_initialized'))
      return
    }

    if (!tradingManagerContract) {
      toast.error(t('payment.errors.contract_not_initialized'))
      return
    }

    try {
      setIsProcessing(true)

      // 检查当前代币授权额度
      const tokenAmount = tokens
      const tokenPrice = BigInt(numeral(item.token_price).value() ?? 0)

      const investorAddress = wallet.address

      console.log('investorAddress', investorAddress)

      // 检查操作者代币余额
      const operatorTokenBalance = await propertyTokenContract.methods.balanceOf(investorAddress).call() as bigint

      console.log(operatorTokenBalance, tokenAmount)

      if (operatorTokenBalance < tokenAmount) {
        toast.error(t('payment.errors.insufficient_balance'))
        setIsProcessing(false)
        return
      }

      // 检查代币授权额度
      const currentTokenAllowance = await propertyTokenContract.methods.allowance(
        investorAddress,
        TradingManagerAddress
      ).call() as number

      // 如果代币授权额度不足，进行授权
      if (currentTokenAllowance < tokenAmount) {
        setIsApproving(true)
        toast.loading(t('payment.info.approving_tokens'))

        try {
          const tokenApproveTx = await propertyTokenContract.methods.approve(
            TradingManagerAddress,
            tokenAmount
          ).send({ from: investorAddress }) as any

          console.log('tokenApproveTx', tokenApproveTx)

          await tokenApproveTx.wait()

          toast.success(t('payment.success.tokens_approved'))

          // 再次检查授权额度
          const newAllowance = await propertyTokenContract.methods.allowance(
            investorAddress,
            TradingManagerAddress
          ).call() as number

          if (newAllowance < tokenAmount) {
            throw new Error(t('payment.errors.approval_failed'))
          }
        }
        catch (error: any) {
          if (error.code === 4001) {
            toast.error(t('payment.errors.approval_rejected'))
          }
          else {
            toast.error(`${t('payment.errors.approval_failed')}: ${error.message}`)
          }
          setIsApproving(false)
          setIsProcessing(false)
          return
        }

        setIsApproving(false)
      }

      // 创建卖单
      toast.loading(t('payment.info.creating_order'))
      const tx = await tradingManagerContract.methods.createSellOrder(
        item.contract_address,
        item.id,
        tokenAmount,
        tokenPrice
      ).send({ from: investorAddress }) as any

      toast.success(t('payment.success.tx_sent'))

      // 等待交易确认
      const receipt = await tx.wait()

      // 调用后端 API 记录交易
      mutate(receipt.hash)

      toast.success(t('payment.success.payment_success'))

      // 返回到前一页或投资页
      setTimeout(() => {
        router.history.back()
      }, 2000)
    }
    catch (error: any) {
      console.error('Error during sell transaction:', error)

      if (error.code === 4001) {
        toast.error(t('payment.errors.rejected'))
      }
      else if (error.reason) {
        toast.error(`${t('payment.errors.contract_revert_with_reason', { reason: error.reason })}`)
      }
      else {
        toast.error(`${t('payment.errors.general', { error: error.message })}`)
      }
    }
    finally {
      setIsProcessing(false)
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
              <QuantitySelector
                value={tokens}
                onChange={setTokens}
                min={1}
                max={item.tokens_held}
                disabled={isPending || isProcessing}
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
        </p>
      </div>

      <div>
        <div className="text-center text-3.5 text-[#898989]">
          {t('properties.payment.expire')}
          14:59
        </div>
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
              loading={isApproving || isProcessing}
              disabled={isPending || isApproving || isProcessing}
            >
              <Waiting for={!(isPending || isApproving || isProcessing)}>
                {isApproving ? t('payment.errors.approving_tokens') : t('action.confirm_sell')}
              </Waiting>
            </Button>
          </div>
          <div></div>
        </div>
      </div>
    </div>
  )
}
