import numeral from 'numeral'
import { IImage } from './i-image'

export const RealEstateCard: FC<{
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

        <div
          className={cn(
            'absolute right-4 top-4 size-8 rounded-full bg-text',
            'flex items-center justify-center',
            'clickable'
          )}
        >
          <div
            className="i-ic-round-favorite-border size-5 bg-gray-4"
          >
          </div>
        </div>
      </div>
      <div className="px-6 py-8 space-y-2">
        <div className="fbc text-5">
          <div>
            $
            {numeral(price).format('0,0')}
          </div>

          <div className="rounded bg-[#8465bb] bg-opacity-50 px-2 py-1 text-3 text-purple">
            {status}
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
            {`${beds} Beds`}
          </div>
          <div>
            {size}
          </div>
          <div>
            2 Years Old
          </div>
        </div>
      </div>
    </div>
  )
}
