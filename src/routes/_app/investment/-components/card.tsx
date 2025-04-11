import { IImage } from '@/components/common/i-image'
import { IInfoField } from '@/components/common/i-info-field'
import { InvestmentOrderType } from '@/enums/investment'
import { joinImagesPath } from '@/utils/url'
import { Button } from 'antd'
import numeral from 'numeral'
import { useTranslation } from 'react-i18next'

interface InvestmentCardProps {
  id: number
  name: string
  location: string
  property_type: string
  token_price: string
  tokens_held: number
  total_amount: string
  rental_yield: string
  image_urls: string
  order_type: InvestmentOrderType
}

export const InvestmentCard: FC<InvestmentCardProps> = ({
  name,
  location,
  property_type,
  token_price,
  tokens_held,
  total_amount,
  rental_yield,
  image_urls,
  order_type
}) => {
  const [firstImage] = joinImagesPath(image_urls)
  const { t } = useTranslation()

  return (
    <div
      className="fyc gap-8 bg-[#1e2024] p-6 space-y-4"
    >
      <div className="w-84 shrink-0 overflow-hidden rounded-lg">
        <IImage src={firstImage} className="size-full" />
      </div>

      <div className="h-full w-full">
        <div className="text-5 font-medium">{name}</div>

        <div className="fbc">
          <IInfoField
            label={t('properties.detail.location')}
            value={location}
            labelClass="text-[#898989]"
            valueClass="text-white"
          />
          <IInfoField
            label={t('properties.detail.property_type')}
            value={property_type}
            labelClass="text-[#898989]"
            valueClass="text-white"
          />
          <IInfoField
            label={t('properties.payment.total')}
            value={`$${numeral(total_amount).format('0,0')}`}
            labelClass="text-[#898989]"
            valueClass="text-white"
          />
          <IInfoField
            label={t('properties.payment.token_price')}
            value={`$${numeral(token_price).format('0,0')} / token`}
            labelClass="text-[#898989]"
            valueClass="text-white"
          />
        </div>

        <div className="fbc">
          <div className="fyc gap-8">
            <IInfoField
              label={t('properties.payment.number')}
              value={`${tokens_held}/1000`}
              labelClass="text-[#898989]"
              valueClass="text-white"
            />
            <IInfoField
              label={t('properties.detail.return')}
              value={`${rental_yield}%`}
              labelClass="text-[#898989]"
              valueClass="text-white"
            />
          </div>

          <div className="w-1/2 fe gap-6">
            {
              order_type === InvestmentOrderType.Buy
                ? (
                    <Button type="primary" size="large" className="w-1/2 text-black!">
                      {t('action.payment')}
                    </Button>
                  )
                : (
                    <Button size="large" className="w-1/2 bg-transparent! text-white!">
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
