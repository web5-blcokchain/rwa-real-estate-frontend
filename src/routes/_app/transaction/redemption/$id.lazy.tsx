import type { ConnectedWallet } from '@privy-io/react-auth'
import { redemption as redemptionApi } from '@/api/profile'
import { IImage } from '@/components/common/i-image'
import { IInfoField } from '@/components/common/i-info-field'
import ISeparator from '@/components/common/i-separator'
import { PaymentMethod } from '@/components/common/payment-method'
import QuantitySelector from '@/components/common/quantity-selector'
import { useCommonDataStore } from '@/stores/common-data'
import { joinImagesPath } from '@/utils/url'
import { useWallets } from '@privy-io/react-auth'
import { useMutation } from '@tanstack/react-query'
import { createLazyFileRoute, useMatch, useNavigate, useRouter } from '@tanstack/react-router'
import { Button } from 'antd'

export const Route = createLazyFileRoute('/_app/transaction/redemption/$id')({
  component: RouteComponent
})

function RouteComponent() {
  const { t } = useTranslation()
  const router = useRouter()
  const navigate = useNavigate()
  const { ready, wallets } = useWallets()
  const [wallet, setWallet] = useState<ConnectedWallet | null>(null)

  const { params } = useMatch({
    from: '/_app/transaction/redemption/$id'
  })

  const id = Number.parseInt(params.id)
  const investmentItems = useCommonDataStore(state => state.investmentItems)
  const item = investmentItems.get(id)!

  const [tokens, setTokens] = useState(1)
  const [buyLoading, setBuyLoading] = useState(false) // 新增loading状态

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async () => {
      const res = await redemptionApi({
        id: `${item.id}`,
        number: `${tokens}`
      })
      return res.data
    }
  })

  async function redemption() {
    if (!wallet) {
      toast.error(t('payment.errors.no_wallet'))
      return
    }

    setBuyLoading(true) // 开始loading

    try {
      // TODO: 钱包交互逻辑

      await mutateAsync()
      toast.success(t('properties.payment.redemption_success'))
    }
    finally {
      setBuyLoading(false) // 结束loading
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
    <div className="mx-auto max-w-7xl p-8 space-y-8 max-lg:p-4">
      <div className="text-center text-6 font-medium">{t('common.redemption_title')}</div>

      <div className="flex gap-6 rounded-xl bg-[#202329] p-6 max-lg:flex-col">
        <div className="h-60 w-100 max-lg:h-auto max-lg:w-full">
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
          <div className="w-full text-[#898989] [&>div]:w-full [&>div]:fyc [&>div]:justify-between space-y-4">
            <div>
              <div>{t('properties.payment.tokens_held')}</div>
              <div className="text-right text-[#898989]">{item.tokens_held}</div>
            </div>
            <div>
              <div>{t('properties.payment.number')}</div>
              <div className="flex justify-end">
                <QuantitySelector
                  value={tokens}
                  onChange={setTokens}
                  min={1}
                  max={item.tokens_held}
                  disabled={isPending}
                />
              </div>
            </div>
            <div>
              <div>{t('properties.payment.subtotal')}</div>
              <div className="text-right">
                $
                {tokens * Number(item.token_price)}
              </div>
            </div>
            <div>
              <div>
                {t('properties.payment.platform_fee')}
                {' '}
                (2%)
              </div>
              <div className="text-right">
                $
                {tokens * Number(item.token_price) * 0.02}
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

          {t('properties.payment.appeal_title')}
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
              onClick={redemption}
              loading={isPending || buyLoading}
              disabled={isPending || buyLoading}
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
