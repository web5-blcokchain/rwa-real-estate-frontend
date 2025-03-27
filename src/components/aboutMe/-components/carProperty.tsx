import { IImage } from '@/components/common/i-image'
import { Button } from 'antd'
import numeral from 'numeral'

const CarProperty: FC<{
  picture: string
  title: string
  location: string
  price: number
  tokenPrice: number
  size: string
  beds: number
  status: number
} & React.HTMLAttributes<HTMLDivElement>> = ({
  picture,
  title,
  location,
  price,
  tokenPrice,
  size,
  beds,
  status,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl bg-background-secondary',
        className
      )}
      {...props}
    >
      <div className="relative h-56">
        <IImage src={picture} className="size-full" />
      </div>

      <div className="px-6 py-8 space-y-2">
        <div className="fbc text-5">
          <div className="text-4 font-medium">{title}</div>

          <div className="rounded bg-[#8465bb] bg-opacity-50 px-2 py-1 text-3 text-purple">
            Residential
            {status}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between">
          <div className="w-1/2 flex flex-col justify-start py-3">
            <div className="text-sm text-[#b5b5b5]">Token Price</div>
            <div className="text-4">
              {`$${numeral(tokenPrice).format('0,0')}`}
            </div>
          </div>

          <div className="w-1/2 flex flex-col justify-start py-3">
            <div className="text-sm text-[#b5b5b5]">Tokens Held</div>
            <div className="text-4">
              100/1000
            </div>
          </div>

          <div className="w-1/2 flex flex-col justify-start py-3">
            <div className="text-sm text-[#b5b5b5]">Annual Yield</div>
            <div className="text-4">
              7.8%
            </div>
          </div>

          <div className="w-1/2 flex flex-col justify-start py-3">
            <div className="text-sm text-[#b5b5b5]">Valuation</div>
            <div className="text-4">
              {`$${numeral(tokenPrice).format('0,0')}`}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <Button
            type="primary"
            size="large"
            className="mr-2 w-1/2 text-black!"
          >
            Traid
          </Button>

          <Button
            size="large"
            className="w-1/2 border-[#9e9e9e] bg-[#202329] text-[#9e9e9e]!"
          >
            Redeem
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CarProperty
