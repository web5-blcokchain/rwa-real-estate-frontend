import { ImageSwiper } from '@/components/common/image-swiper'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Button, Input } from 'antd'
import { LocationCard } from './-cards/location'
import { PropertyDescriptionCard } from './-cards/property-description'

export const Route = createLazyFileRoute('/_app/properties/detail/')({
  component: RouteComponent
})

function RouteComponent() {
  const list = Array.from({ length: 10 }, (_, i) => `https://swiperjs.com/demos/images/nature-${i + 1}.jpg`)

  return (
    <div className="px-8 space-y-8">
      <div className="grid grid-cols-1 w-full gap-8 md:grid-cols-2">
        <div>
          <ImageSwiper list={list} />
        </div>

        <div>
          <div className="fb gap-4 px-6">
            <div className="space-y-4">
              <div className="text-6">23 Berwick Street</div>
              <div className="text-4 text-[#d9d9d9]">23 Berwick Street, Nottingham, Durham County, SR8 5SA</div>
            </div>
            <div className="size-10 fcc shrink-0 rounded-full bg-primary clickable">
              <div className="i-ic-round-favorite-border"></div>
            </div>
          </div>

          <div className="grid grid-cols-2 my-4 px-6">
            <BaseInfoField label="Property Type" value="Detached House" />
            <BaseInfoField label="Bedrooms" value="2" />
            <BaseInfoField label="Market Value" value="£1.24M" valueClass="text-primary" />
            <BaseInfoField label="Monthly Rent" value="£1,000" />
          </div>

          <div className="rounded-lg bg-background-secondary p-6 space-y-2">
            <div className="text-4.5">Expected Annual Return</div>
            <div className="text-7.5 text-primary">5.00%</div>
            <div className="text-4 text-[#898989]">Including 5.00% rental yield and 0.00% capital appreciation</div>

            <div className="fbc pt-4">
              <div className="text-4.5">Investment Calculator</div>
              <div className="text-4 text-[#898989]">verage 30-day</div>
            </div>

            <div>
              <Input
                className="bg-background! text-text! [&>input]:(placeholder-text-[#898989])"
                size="large"
                placeholder="Enter investment amount"
                suffix="GBP"
              />
            </div>

            <div className="fbc">
              <BaseInfoField
                className="space-y-2"
                labelClass="text-[#898989]"
                label="Expected Annual Return"
                value="£0"
              />
              <BaseInfoField
                className="space-y-2"
                labelClass="text-[#898989]"
                label="Investment Ratio"
                value="0%"
              />
            </div>

            <div>
              <Button type="primary" size="large" className="w-full text-black!">Invest Now</Button>
            </div>
          </div>
        </div>

        <PropertyDescriptionCard />

        <LocationCard />
      </div>

      <div className="space-y-4">
        <div className="text-5">Market Analysis</div>

        <div className="grid grid-cols-1 w-full gap-8 md:grid-cols-2">
          <div>left</div>
          <div>right</div>
        </div>
      </div>
    </div>
  )
}

const BaseInfoField: FC<{
  label: string
  value: string
  labelClass?: string
  valueClass?: string
}> = ({
  label,
  value,
  className,
  labelClass,
  valueClass
}) => {
  return (
    <div className={cn(
      'py-4 space-y-4',
      className
    )}
    >
      <div className={cn(
        'text-3.5 text-[#d9d9d9]',
        labelClass
      )}
      >
        {label}
      </div>
      <div className={cn(
        'text-4',
        valueClass
      )}
      >
        {value}
      </div>
    </div>
  )
}
