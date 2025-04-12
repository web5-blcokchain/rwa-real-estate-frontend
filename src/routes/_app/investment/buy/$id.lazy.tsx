import { buyAsset } from '@/api/investment'
import { IImage } from '@/components/common/i-image'
import { IInfoField } from '@/components/common/i-info-field'
import ISeparator from '@/components/common/i-separator'
import { useCommonDataStore } from '@/stores/common-data'
import { joinImagesPath } from '@/utils/url'
import { useMutation } from '@tanstack/react-query'
import { createLazyFileRoute, useMatch, useNavigate, useRouter } from '@tanstack/react-router'
import { Button } from 'antd'

export const Route = createLazyFileRoute('/_app/investment/buy/$id')({
  component: RouteComponent
})

function RouteComponent() {
  const { t } = useTranslation()
  const router = useRouter()
  const navigate = useNavigate()

  const { params } = useMatch({
    from: '/_app/investment/buy/$id'
  })

  const id = Number.parseInt(params.id)
  const investmentItems = useCommonDataStore(state => state.investmentItems)
  const item = investmentItems.get(id)!

  const [tokens, setTokens] = useState(1)

  const plus = () => setTokens(tokens + 1)
  const minus = () => {
    if (tokens > 1) {
      setTokens(tokens - 1)
    }
  }
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async () => {
      const res = await buyAsset({ order_market_id: item.id })
      return res.data
    }
  })

  function buy() {
    mutateAsync()
      .then((response) => {
        console.log(response)
      })
  }

  useEffect(() => {
    if (!item) {
      toast.error(t('properties.payment.asset_not_found'))
      navigate({
        to: '/investment/buy/$id',
        params
      })
    }
  }, [item, navigate, params, t])

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
            <div className="fyc gap-4">
              <Button className="b-none text-white bg-[#374151]!" onClick={minus}>-</Button>
              <div className="w-12 select-none text-center">{tokens}</div>
              <Button className="b-none text-white bg-[#374151]!" onClick={plus}>+</Button>
            </div>

            <div className="text-right">
              $
              {tokens * 500}
            </div>
            <div className="text-right">
              $
              {tokens * 10}
            </div>
          </div>
        </div>

        <ISeparator className="bg-white" />

        <div className="fbc">
          <div>{t('properties.payment.total_amount')}</div>
          <div className="text-primary">$510</div>
        </div>
      </div>

      <div className="rounded-xl bg-[#202329] p-6 space-y-4">
        <div className="text-4.5">{t('properties.payment.payment_method')}</div>
        <div className="grid grid-cols-2 gap-6">
          <div className="fcc select-none b b-background rounded-xl b-solid bg-[#212936] py-6 clickable-99">
            <div className="fccc">
              <SvgIcon name="credit-card" className="size-8" />
              <div>
                {t('properties.payment.credit_card')}
              </div>
            </div>
          </div>

          <div className="fcc select-none b b-background rounded-xl b-solid bg-[#212936] py-6 clickable-99">
            <div className="fccc">
              <SvgIcon name="cryptocurrency" className="size-8" />
              <div>
                {t('properties.payment.cryptocurrency')}
              </div>
            </div>
          </div>
        </div>
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
              onClick={buy}
              loading={false}
              disabled={isPending}
            >
              <Waiting for={!isPending}>
                {t('properties.payment.confirm_payment')}
              </Waiting>
            </Button>
          </div>
          <div></div>
        </div>
      </div>
    </div>
  )
}
