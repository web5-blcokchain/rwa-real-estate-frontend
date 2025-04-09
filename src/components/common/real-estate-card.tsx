import numeral from 'numeral'
import { CollectButton } from './collect-button'
import { IImage } from './i-image'

export const RealEstateCard: FC<{
  picture: string
  title: string
  location: string
  price: number
  tokenPrice: number
  area: number
  bedrooms: number
  property_type: string
  houseId: number
  collect: 0 | 1
  house_life: number
} & React.HTMLAttributes<HTMLDivElement>> = ({
  picture,
  title,
  location,
  price,
  tokenPrice,
  area,
  bedrooms,
  property_type,
  houseId,
  collect,
  house_life,
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

        <CollectButton
          houseId={houseId}
          collect={collect}
        />
      </div>
      <div className="px-6 py-8 space-y-2">
        <div className="fbc text-5">
          <div>
            $
            {numeral(price).format('0,0')}
          </div>

          <div className="rounded bg-[#8465bb] bg-opacity-50 px-2 py-1 text-3 text-purple">
            {property_type}
          </div>
        </div>

        <div className="fbc">
          <div className="text-4">
            {`Token Price: $${numeral(tokenPrice).format('0,0')}`}
          </div>
        </div>

        <div className="text-4 font-medium">{title}</div>

        <div className="text-sm text-[#b5b5b5]">{location}</div>

        <div className="py-2">
          <div className="h-1px bg-white"></div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div>
            {`${bedrooms} Beds`}
          </div>
          <div>
            {`${area} sq ft`}
          </div>
          <div>
            {`${house_life} Years Old`}
          </div>
        </div>
      </div>
    </div>
  )
}
