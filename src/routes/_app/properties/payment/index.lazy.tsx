import type { DetailResponse } from '@/api/basicApi'
import { _useStore as useStore } from '@/_store/_userStore'
import { IImage } from '@/components/common/i-image'
import { IInfoField } from '@/components/common/i-info-field'
import ISeparator from '@/components/common/i-separator'
import { createLazyFileRoute, useRouter } from '@tanstack/react-router'
import { Button } from 'antd'

export const Route = createLazyFileRoute('/_app/properties/payment/')({
  component: RouteComponent
})

function RouteComponent() {
  const { t } = useTranslation()
  const router = useRouter()
  const assetObj = useStore(state => state.assetObj) as DetailResponse

  const [tokens, setTokens] = useState(1)

  const plus = () => setTokens(tokens + 1)
  const minus = () => {
    if (tokens > 1) {
      setTokens(tokens - 1)
    }
  }

  return (
    <div className="max-w-7xl p-8 space-y-8">
      <div className="text-center text-6 font-medium">Payment Confirmation</div>

      <div className="flex gap-6 rounded-xl bg-[#202329] p-6">
        <div className="h-60 w-100">
          <IImage src="https://picsum.photos/400/240" className="size-full rounded" />
        </div>
        <div>
          <div className="text-6 font-medium">{assetObj?.name}</div>

          <div className="grid grid-cols-2 mt-4 gap-x-4">
            <IInfoField
              label="Location"
              value={assetObj?.address}
              labelClass="text-[#898989]"
              className="space-y-2"
            />
            <IInfoField
              label="Property Type"
              value={assetObj?.property_type}
              labelClass="text-[#898989]"
              className="space-y-2"
            />
            <IInfoField
              label="Token Price"
              value={assetObj?.price}
              labelClass="text-[#898989]"
              className="space-y-2"
            />
            <IInfoField
              label="Total Valuation"
              value={Number(assetObj?.number) * Number(assetObj?.price)}
              labelClass="text-[#898989]"
              className="space-y-2"
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-[#202329] p-6 space-y-4">
        <div className="text-4.5">Payment Details</div>

        <div className="flex items-center justify-between text-4">
          <div className="text-[#898989] space-y-4">
            <div>Number of Tokens</div>
            <div>Subtotal</div>
            <div>Platform Fee (2%)</div>
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
          <div>Total Amount</div>
          <div className="text-primary">$510</div>
        </div>
      </div>

      <div className="rounded-xl bg-[#202329] p-6 space-y-4">
        <div className="text-4.5">Payment Method</div>
        <div className="grid grid-cols-2 gap-6">
          <div className="fcc select-none b b-background rounded-xl b-solid bg-[#212936] py-6 clickable-99">
            <div className="fccc">
              <SvgIcon name="credit-card" className="size-8" />
              <div>
                Credit Card
              </div>
            </div>
          </div>

          <div className="fcc select-none b b-background rounded-xl b-solid bg-[#212936] py-6 clickable-99">
            <div className="fccc">
              <SvgIcon name="cryptocurrency" className="size-8" />
              <div>
                Cryptocurrency
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-[#202329] p-6 text-4 text-[#898989] space-y-2">
        <p>Dear User,</p>
        <p>
          To ensure the security of OTC transactions,
          you must meet the following requirements and complete the necessary verification process:
        </p>
        <p>Your account must be fully verified with a valid government-issued ID or passport.</p>
      </div>

      <div>
        <div className="text-center text-3.5 text-[#898989]">
          Payment will expire in 14:59
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
              className="text-black!"
              onClick={() => router.navigate({ to: '/properties/distribution' })}
            >
              Confirm Payment
            </Button>
          </div>
          <div></div>
        </div>
      </div>
    </div>
  )
}
