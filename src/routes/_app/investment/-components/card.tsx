import type { InvestmentOrderType } from '@/enums/investment'
import { IImage } from '@/components/common/i-image'
import { IInfoField } from '@/components/common/i-info-field'
import { InvestmentTab } from '@/enums/investment'
import { useCommonDataStore } from '@/stores/common-data'
import { useUserStore } from '@/stores/user'
import { formatNumberNoRound } from '@/utils/number'
import { joinImagesPath } from '@/utils/url'
import { useNavigate } from '@tanstack/react-router'
import { Button } from 'antd'
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
    user_id: number
    expected_annual_return: string
    properties_id: number
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
  const userData = useUserStore(state => state.userData)

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
      className="fyc gap-8 bg-[#1e2024] p-6 max-lg:flex-col space-y-4 max-lg:px-0 max-lg:py-4"
    >
      <div className="h-64 max-w-full w-84 shrink-0 overflow-hidden rounded-lg">
        <IImage
          src={firstImage}
          className="size-full"
          imgClass="object-cover"
        />
      </div>

      <div className="h-full w-full">
        <div
          onClick={(() => navigate({
            to: `/properties/detail/${item.properties_id}`
          }))}
          className="cursor-pointer text-5 font-medium hover:text-primary"
        >
          {item.name}
        </div>

        <div className="grid grid-cols-4 gap-4 max-lg:grid-cols-2 [&>div]:w-full">
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
            value={`$${formatNumberNoRound(item.total_amount, 8)}`}
            labelClass="text-[#898989]"
            valueClass="text-white"
          />
          <IInfoField
            label={t('properties.payment.token_price')}
            value={`$${formatNumberNoRound(item.token_price, 8)}`}
            labelClass="text-[#898989]"
            valueClass="text-white"
          />
        </div>

        <div className="fbc max-lg:flex-col">
          <div className="w-fit fbc gap-2 overflow-hidden max-lg:w-full max-xl:flex-col max-xl:items-start">
            <div className="fyc gap-8">
              <IInfoField
                label={t('properties.payment.number')}
                value={`${item.total_selling}`}
                labelClass="text-[#898989]"
                valueClass="text-white"
              />
              <IInfoField
                label={t('properties.detail.return')}
                value={`${item.expected_annual_return}%`}
                labelClass="text-[#898989]"
                valueClass="text-white"
              />
            </div>

            <div className="fyc gap-2">
              {/* <div className="size-8 overflow-hidden rounded-full">
                <IImage src={joinImagePath(item.avatar)} alt="avatar" className="size-full" />
              </div> */}
              <div>{item.nickname}</div>
            </div>
          </div>

          <div className="w-1/2 fe gap-6 max-lg:mt-4 max-lg:w-full">
            {
              type === InvestmentTab.Sale && (
                <Button
                  type="primary"
                  size="large"
                  className="w-1/2 max-lg:w-full text-black!"
                  disabled={userData.id === item.user_id}
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
                  className="w-1/2 max-lg:w-full bg-transparent! text-white! disabled:text-gray-5!"
                  disabled={userData.id === item.user_id}
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
