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
        'of-hidden rounded-xl bg-background-secondary',
        className
      )}
      {...props}
    >
      <div>
        <IImage
          src={picture}
          alt="picture"
          className="h-54 w-full"
          imgClass="object-cover"
        />
      </div>
      <div className="px-6 py-8 space-y-2">
        <div className="text-5">{title}</div>
        <div className="fbc text-4">
          <div className="text-[#b5b5b5]">{location}</div>
          <div>
            ¥
            {price}
            M
          </div>
        </div>

        <div className="fbc">
          <div className="text-3.5 text-[#b5b5b5]">
            {`House life: ${house_life} Years`}
          </div>
          <div className="text-4">
            {`Bedrooms: ${bedrooms}`}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FeatureCard
