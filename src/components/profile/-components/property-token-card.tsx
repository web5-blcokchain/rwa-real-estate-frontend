import { IImage } from '@/components/common/i-image'
import { joinImagePath } from '@/utils/url'
import { Button } from 'antd'
import numeral from 'numeral'

const PropertyTokenCard: FC<{
  picture: string
  title: string
  location: string
  price: number
  tokenPrice: number
  size: string
  beds: number
  property_type: string
  annual_return?: number
  number?: number
} & React.HTMLAttributes<HTMLDivElement>> = ({
  picture,
  title,
  location,
  price,
  tokenPrice,
  size,
  beds,
  property_type,
  className,
  annual_return,
  number,
  ...props
}) => {
  const onTraidClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    // 这里处理 Traid 按钮点击逻辑
    console.log('Traid clicked')
  }

  const onRedeemClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    // 这里处理 Redeem 按钮点击逻辑
    console.log('Redeem clicked')
  }

  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl bg-background-secondary cursor-pointer',
        className
      )}
      {...props}
    >
      <div className="relative h-56">
        <IImage
          src={joinImagePath(picture)}
          className="size-full"
          imgClass="object-cover"
        />
      </div>

      <div className="px-6 py-8 space-y-2">
        <div className="fbc text-5">
          <div className="text-4 font-medium">{title}</div>

          <div className="rounded bg-[#8465bb] bg-opacity-50 px-2 py-1 text-3 text-purple">
            {property_type}
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
              {number}
              /1000
            </div>
          </div>

          <div className="w-1/2 flex flex-col justify-start py-3">
            <div className="text-sm text-[#b5b5b5]">Annual Yield</div>
            <div className="text-4">
              {annual_return}
              %
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
            onClick={onTraidClick}
          >
            Traid
          </Button>

          <Button
            size="large"
            className="w-1/2 border-[#9e9e9e] bg-[#202329] text-[#9e9e9e]!"
            onClick={onRedeemClick}
          >
            Redeem
          </Button>
        </div>
      </div>
    </div>
  )
}

export default PropertyTokenCard
