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
  sell_order_id,
  token_number,
  total_selling,
  contract_address,
  className,
  ...props
}) => {
  const navigate = useNavigate()
  const investmentItems = useCommonDataStore(state => state.investmentItems)
  const { t } = useTranslation()

  const createSellOrder = (e: React.MouseEvent) => {
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
      sell_order_id,
      order_type: InvestmentOrderType.Buy,
      contract_address,
      token_number,
      total_selling
    })

    navigate({
      to: '/transaction/create-sell-order/$id',
      params: { id: `${properties_id}` }
    })
  }

  // const redemption = (e: React.MouseEvent) => {
  //   e.stopPropagation()

  //   investmentItems.set(properties_id, {
  //     id: properties_id,
  //     name,
  //     location: address,
  //     property_type,
  //     token_price: current_price,
  //     tokens_held: number,
  //     total_amount: total_current,
  //     rental_yield: expected_annual_return,
  //     image_urls,
  //     sell_order_id,
  //     order_type: InvestmentOrderType.Buy,
  //     contract_address,
  //     token_number,
  //     total_selling
  //   })

  //   navigate({
  //     to: '/transaction/redemption/$id',
  //     params: { id: `${properties_id}` }
  //   })
  // }

  const [firstImage] = joinImagesPath(image_urls)

  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl bg-background-secondary cursor-pointer',
        className
      )}
      {...props}
    >
      <div className="relative h-56 max-lg:h-auto max-lg:w-full">
        <IImage
          src={firstImage}
          className="size-full"
          imgClass="object-cover"
        />
      </div>

      <div className="px-6 py-8 space-y-2">
        <div className="fbc gap-2 text-5">
          <div title={name} className="flex-1 truncate text-4 font-medium">{name}</div>

          <div className="rounded bg-[#8465bb] bg-opacity-50 px-2 py-1 text-3 text-purple">
            {property_type}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between">
          <div className="w-1/2 flex flex-col justify-start py-3">
            <div className="text-sm text-[#b5b5b5]">{t('properties.payment.token_price')}</div>
            <div className="text-4">
              {`$${numeral(current_price).format('0,0.00')}`}
            </div>
          </div>

          <div className="w-1/2 flex flex-col justify-start py-3">
            <div className="text-sm text-[#b5b5b5]">{t('properties.payment.tokens_held')}</div>
            <div className="text-4">
              {number}
              /
              {Inception_number}
            </div>
          </div>

          <div className="w-1/2 flex flex-col justify-start py-3">
            <div className="text-sm text-[#b5b5b5]">{t('properties.payment.annual_yield')}</div>
            <div className="text-4">
              {expected_annual_return}
              %
            </div>
          </div>

          <div className="w-1/2 flex flex-col justify-start py-3">
            <div className="text-sm text-[#b5b5b5]">{t('properties.payment.valuation')}</div>
            <div className="text-4">
              {`$${numeral(current_price).format('0,0')}`}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <Button
            type="primary"
            size="large"
            className="mr-2 w-full text-black!"
            onClick={createSellOrder}
            disabled={number <= 0}
          >
            {t('properties.payment.create_sell_order')}
          </Button>

          {/* <Button
            size="large"
            className="w-1/2 border-[#9e9e9e] bg-[#202329] text-[#9e9e9e]!"
            onClick={redemption}
          >
            {t('properties.payment.redeem')}
          </Button> */}
        </div>
      </div>
    </div>
  )
}

export default PropertyTokenCard
