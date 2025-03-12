import { IImage } from '@/components/common/i-image'
import { IInfoField } from '@/components/common/i-info-field'
import ISeparator from '@/components/common/i-separator'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Button } from 'antd'

export const Route = createLazyFileRoute('/_app/properties/payment/')({
  component: RouteComponent
})

function RouteComponent() {
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
          <div className="text-6 font-medium">23 Berwick Street</div>

          <div className="grid grid-cols-2 mt-4 gap-x-4">
            <IInfoField
              label="Location"
              value="innan 1-chome, Shibuya-ku"
              labelClass="text-[#898989]"
              className="space-y-2"
            />
            <IInfoField
              label="Property Type"
              value="Luxury Apartment"
              labelClass="text-[#898989]"
              className="space-y-2"
            />
            <IInfoField
              label="Token Price"
              value="$500 / token"
              labelClass="text-[#898989]"
              className="space-y-2"
            />
            <IInfoField
              label="Total Valuation"
              value="$5,000,000"
              labelClass="text-[#898989]"
              className="space-y-2"
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-[#202329] p-6 space-y-6">
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

            <div className="text-right">$500</div>
            <div className="text-right">$10</div>
          </div>
        </div>

        <ISeparator className="bg-white" />

        <div className="fbc">
          <div>Total Amount</div>
          <div className="text-primary">$510</div>
        </div>
      </div>
    </div>
  )
}
