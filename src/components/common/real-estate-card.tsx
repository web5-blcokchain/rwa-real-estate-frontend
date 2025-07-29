import { formatNumberNoRound } from '@/utils/number'
import numbro from 'numbro'
import { CollectButton } from './collect-button'
import { ImageSwiper } from './image-swiper'

export const RealEstateCard: FC<{
  pictures: string[]
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
  expected_annual_return: number
  annual_return_max: number
  annual_return_min: number
} & React.HTMLAttributes<HTMLDivElement>> = ({
  pictures,
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
  expected_annual_return,
  annual_return_max,
  annual_return_min,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl bg-background-secondary flex flex-col',
        className
      )}
      {...props}
    >
      <div className="relative h-56">
        {/* <IImage src={picture} className="size-full" /> */}
        <ImageSwiper swiperClass="!rounded-0" autoplay={false} list={pictures} className="size-full h-full" />
        <CollectButton
          houseId={houseId}
          collect={collect}
          queryKey={['properties']}
          className="absolute right-4 top-4 z-2"
        />
      </div>
      <div className="flex flex-1 flex-1 flex-col space-y-2">
        <div className="px-3 space-y-2">
          <div className="fyc gap-2 pt-2">
            <div className="flex-1 truncate text-xl font-medium">{title}</div>
            <div className="rounded bg-#4c4f53 bg-opacity-50 px-2 py-1 text-3 text-#e7bb41">
              {property_type}
            </div>
          </div>
          <div className="line-clamp-1 text-sm text-[#b5b5b5]">{location}</div>
          <div className="fyc gap-1 [&>div]:flex-1 [&>div]:truncate">
            <div>
              市场价值:$
              {numbro(price).format({
                mantissa: 2,
                thousandSeparated: true
              })}
            </div>
            <div>
              月租金:$
              {numbro(price).format({
                mantissa: 2,
                thousandSeparated: true
              })}
            </div>
          </div>
        </div>
        <div className="fyc flex-1 bg-#e7bb41 py-2 text-black [&>div]:fccc [&>div]:flex-1">
          <div>
            <div className="text-xl font-bold">
              {' '}
              {expected_annual_return}
              %
            </div>
            <div className="mt-1 text-sm">租金收益</div>
          </div>
          <div>
            <div className="truncate text-xl font-bold" title={`${formatNumberNoRound(`${annual_return_min}`, 2)}% ~ ${formatNumberNoRound(`${annual_return_max}`, 2)}%`}>
              {formatNumberNoRound(`${12.22}`, 2)}
              %
              ~
              {formatNumberNoRound(`${annual_return_max}`, 2)}
              %
            </div>
            <div className="mt-1 text-sm">预计年回报率</div>
          </div>
        </div>
      </div>
    </div>
  )
}
