import { IImage } from '../common/i-image'

interface Props {
  picture: string
  title: string
  location: string
  price: number
  house_life: number
  bedrooms: number
}

const FeatureCard: FC<
  Props & React.HTMLProps<HTMLDivElement>
> = ({
  title,
  picture,
  location,
  price,
  house_life,
  bedrooms,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'of-hidden rounded-5 bg-#1f2328 flex flex-col max-xl:rounded-3 max-lg:rounded-2',
        className
      )}
      {...props}
    >
      <div>
        <IImage
          src={picture}
          alt="picture"
          className="aspect-ratio-2/1 w-full"
          imgClass="object-cover"
        />
      </div>
      <div className="h-full flex flex-1 flex-col justify-between px-5 pb-6 pt-5 max-lg:px-2 max-md:px-6px max-xl:px-3 max-lg:pb-2 max-lg:pt-2 max-md:pb-2 max-md:pt-2 max-xl:pb-4 max-xl:pt-3">
        <div>
          <div className="text-7 leading-10 max-lg:text-3 max-md:text-2 max-xl:text-5 max-lg:leading-5 max-md:leading-13px max-xl:leading-7">{title}</div>
          <div className="pb-4 pt-2 text-6 text-[#b5b5b5] leading-7 max-lg:pb-1 max-lg:pt-1 max-xl:pb-2 max-xl:pt-1 max-lg:text-2 max-md:text-6px max-xl:text-4 max-lg:leading-4 max-md:leading-10px max-xl:leading-5">
            {location}
          </div>
          <div className="fbc">
            <div className="truncate rounded-6px bg-#F0B90B px-10px text-5 text-#131518 leading-30px max-lg:text-2 max-md:text-5px max-xl:text-4 max-lg:leading-5 max-md:leading-2 max-xl:leading-7">
              {`房屋寿命: ${house_life} 年`}
            </div>
            <div className="truncate rounded-6px bg-#F0B90B px-10px text-5 text-#131518 leading-30px max-lg:text-2 max-md:text-5px max-xl:text-4 max-lg:leading-5 max-md:leading-2 max-xl:leading-7">
              {`卧室: ${bedrooms}`}
            </div>
          </div>
        </div>
        <div className="mt-21px fyc justify-between text-30px leading-40px max-lg:mt-5px max-md:mt-8px max-xl:mt-10px max-lg:text-12px max-md:text-10px max-xl:text-18px max-lg:leading-16px max-md:leading-10px max-xl:leading-24px">
          <div>
            $
            {price}
            米
          </div>
          <div className="rounded-full bg-#F0B90B">
            <div className="i-radix-icons:arrow-top-right size-34px bg-#131518 max-lg:size-16px max-md:size-10px max-xl:size-24px"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FeatureCard
