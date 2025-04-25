import type { TokenHeldItem } from '@/types/profile'
import { IImage } from '@/components/common/i-image'
import { InvestmentOrderType } from '@/enums/investment'
import { useCommonDataStore } from '@/stores/common-data'
import { joinImagesPath } from '@/utils/url'
import { useNavigate } from '@tanstack/react-router'
import { Button } from 'antd'
import numeral from 'numeral'

const PropertyTokenCard: FC<Omit<TokenHeldItem, 'id'> & { id: any } & React.HTMLAttributes<HTMLDivElement>> = ({
  Inception_number,
  name,
  image_urls,
  location,
  address,
  properties_id,
  property_type,
  current_price,
  total_current,
  expected_annual_return,
  number,
  className,
  ...props
}) => {
  const navigate = useNavigate()
  const investmentItems = useCommonDataStore(state => state.investmentItems)

  const onSellClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    investmentItems.set(properties_id, {
      id: properties_id,
      name,
      location: address,
      property_type,
      token_price: current_price,
      tokens_held: number,
      total_amount: total_current,
      rental_yield: expected_annual_return,
      image_urls,
      order_type: InvestmentOrderType.Buy,
      contract_address: `${properties_id}`
    })
    navigate({
      to: '/transaction/sell/$id',
      params: { id: `${properties_id}` }
    })
  }

  const onRedeemClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    // 这里处理 Redeem 按钮点击逻辑
    console.log('Redeem clicked')
  }

  const [firstImage] = joinImagesPath(image_urls)

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
          src={firstImage}
          className="size-full"
          imgClass="object-cover"
        />
      </div>

      <div className="px-6 py-8 space-y-2">
        <div className="fbc text-5">
          <div className="text-4 font-medium">{name}</div>

          <div className="rounded bg-[#8465bb] bg-opacity-50 px-2 py-1 text-3 text-purple">
            {property_type}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between">
          <div className="w-1/2 flex flex-col justify-start py-3">
            <div className="text-sm text-[#b5b5b5]">Token Price</div>
            <div className="text-4">
              {`$${numeral(current_price).format('0,0.00')}`}
            </div>
          </div>

          <div className="w-1/2 flex flex-col justify-start py-3">
            <div className="text-sm text-[#b5b5b5]">Tokens Held</div>
            <div className="text-4">
              {number}
              /
              {Inception_number}
            </div>
          </div>

          <div className="w-1/2 flex flex-col justify-start py-3">
            <div className="text-sm text-[#b5b5b5]">Annual Yield</div>
            <div className="text-4">
              {expected_annual_return}
              %
            </div>
          </div>

          <div className="w-1/2 flex flex-col justify-start py-3">
            <div className="text-sm text-[#b5b5b5]">Valuation</div>
            <div className="text-4">
              {`$${numeral(current_price).format('0,0')}`}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <Button
            type="primary"
            size="large"
            className="mr-2 w-1/2 text-black!"
            onClick={onSellClick}
          >
            Sell
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
