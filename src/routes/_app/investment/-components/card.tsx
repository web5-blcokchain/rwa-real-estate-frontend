import type { InvestmentOrderType } from '@/enums/investment'
import { IImage } from '@/components/common/i-image'
import { IInfoField } from '@/components/common/i-info-field'
import { InvestmentTab } from '@/enums/investment'
import { useCommonDataStore } from '@/stores/common-data'
import { joinImagePath, joinImagesPath } from '@/utils/url'
import { useNavigate } from '@tanstack/react-router'
import { Button } from 'antd'
import numeral from 'numeral'
import { useTranslation } from 'react-i18next'

interface InvestmentCardProps {
  item: {
    id: number
    name: string
    address: string
    location: string
    contract_address: string
    property_type: string
    token_price: string
    tokens_held: number
    total_amount: string
    token_number: number
    rental_yield: string
    image_urls: string
    total_selling: number
    has_holdings: boolean
    is_me: boolean
    order_type: InvestmentOrderType
    sell_order_id: string
    avatar: string
    nickname: string
  }
  type: InvestmentTab
}

export const InvestmentCard: FC<InvestmentCardProps> = ({
  item,
  type
}) => {
  const [firstImage] = joinImagesPath(item.image_urls)
  const { t } = useTranslation()
  const navigate = useNavigate()
  const investmentItems = useCommonDataStore(state => state.investmentItems)

  function buy() {
    investmentItems.set(item.id, item)

    navigate({
      to: '/transaction/buy/$id',
      params: {
        id: `${item.id}`
      }
    })
  }

  function sell() {
    investmentItems.set(item.id, item)

    navigate({
      to: '/transaction/sell/$id',
      params: {
        id: `${item.id}`
      }
    })
  }

  return (
    <div
      className="fyc gap-8 bg-[#1e2024] p-6 space-y-4"
    >
      <div className="h-64 w-84 shrink-0 overflow-hidden rounded-lg">
        <IImage
          src={firstImage}
          className="size-full"
          imgClass="object-cover"
        />
      </div>

      <div className="h-full w-full">
        <div className="text-5 font-medium">{item.name}</div>

        <div className="fb gap-4">
          <IInfoField
            label={t('properties.detail.location')}
            value={item.address}
            className="w-1/2"
            labelClass="text-[#898989]"
            valueClass="text-white"
          />
          <IInfoField
            label={t('properties.detail.property_type')}
            value={item.property_type}
            labelClass="text-[#898989]"
            valueClass="text-white"
          />
          <IInfoField
            label={t('properties.payment.total')}
            value={`$${numeral(item.total_amount).format('0,0')}`}
            labelClass="text-[#898989]"
            valueClass="text-white"
          />
          <IInfoField
            label={t('properties.payment.token_price')}
            value={`$${numeral(item.token_price).format('0,0')}`}
            labelClass="text-[#898989]"
            valueClass="text-white"
          />
        </div>

        <div className="fbc">
          <div className="fyc gap-8">
            <IInfoField
              label={t('properties.payment.number')}
              value={`${item.tokens_held}/${item.total_selling}`}
              labelClass="text-[#898989]"
              valueClass="text-white"
            />
            <IInfoField
              label={t('properties.detail.return')}
              value={`${item.rental_yield}%`}
              labelClass="text-[#898989]"
              valueClass="text-white"
            />
          </div>

          <div className="fyc gap-2">
            <div className="size-8 overflow-hidden rounded-full">
              <IImage src={joinImagePath(item.avatar)} alt="avatar" className="size-full" />
            </div>
            <div>{item.nickname}</div>
          </div>

          <div className="w-1/2 fe gap-6">
            {
              type === InvestmentTab.Sale && (
                <Button
                  type="primary"
                  size="large"
                  className="w-1/2 text-black!"
                  disabled={item.is_me}
                  onClick={buy}
                >
                  {t('action.payment')}
                </Button>
              )
            }

            {
              type === InvestmentTab.WantToBuy && (
                <Button
                  size="large"
                  className="w-1/2 bg-transparent! text-white! disabled:text-gray-5!"
                  disabled={!item.has_holdings || item.is_me}
                  onClick={sell}
                >
                  {t('action.sell')}
                </Button>
              )
            }
          </div>
        </div>
      </div>
    </div>
  )
}
