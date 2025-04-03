import type { DetailResponse } from '@/api/basicApi'
import { _useStore as useStore } from '@/_store/_userStore'
import apiBasic from '@/api/basicApi'
import { IInfoField } from '@/components/common/i-info-field'
import { ImageSwiper } from '@/components/common/image-swiper'
import { useQuery } from '@tanstack/react-query'
import { createLazyFileRoute, useNavigate } from '@tanstack/react-router'
import { Button, Input, Spin } from 'antd'
import { useEffect, useState } from 'react'
import { LocationCard } from './-cards/location'
import { PropertyDescriptionCard } from './-cards/property-description'
import { RegionalPriceTrendsCard } from './-cards/regional-price-trends'
import { RentalIncomeAnalysisCard } from './-cards/rental-income-analysis'

export const Route = createLazyFileRoute('/_app/properties/detail/')({
  component: RouteComponent
})

function RouteComponent() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const assetId = useStore(state => state.assetId)
  const setAssetObj = useStore(state => state.setAssetObj)
  const [investmentPrice, setInvestmentPrice] = useState<number>(0)
  const [annualReturn, setAnnualReturn] = useState<number>(0)
  const [ratioNum, setRatioNum] = useState<number>(0)

  const { data: detailObj, isLoading } = useQuery<DetailResponse>({
    queryKey: ['property-detail', assetId],
    queryFn: async () => {
      const response = await apiBasic.getDataListDetail({ id: assetId })
      return response.data
    }
  })

  useEffect(() => {
    if (!detailObj)
      return

    const monthlyRent = Number(detailObj.monthly_rent)
    const expectedAnnualReturn = Number(detailObj.expected_annual_return)
    const price = Number(detailObj.price)
    const capitalAppreciation = Number(detailObj.capital_appreciation)

    const rentalNum = monthlyRent * expectedAnnualReturn / 100
    const capitalNum = price * capitalAppreciation / 100
    const annualReturnValue = (rentalNum + capitalNum) * 12

    setAnnualReturn(annualReturnValue)
    setRatioNum(20)
    // setRatioNum(Number(((investmentPrice * 12) / (rentalNum + capitalNum)) * 100))
  }, [investmentPrice, detailObj])

  const imageList = detailObj?.image_urls?.split(',') || []

  if (isLoading) {
    return (
      <div className="w-full p-8 h-dvh">
        <Spin />
      </div>
    )
  }

  return (
    <div className="px-8 space-y-8">
      <div className="grid grid-cols-1 w-full gap-8 md:grid-cols-2">
        {imageList.length > 0 && (
          <div>
            <ImageSwiper list={imageList} />
          </div>
        )}

        <div>
          <div className="fb gap-4 px-6">
            <div className="space-y-4">
              <div className="text-6">{detailObj?.name}</div>
              <div className="text-4 text-[#d9d9d9]">{detailObj?.address}</div>
            </div>
            <div className="size-10 fcc shrink-0 rounded-full bg-primary clickable">
              <div className="i-ic-round-favorite-border"></div>
            </div>
          </div>

          <div className="grid grid-cols-2 my-4 px-6">
            <IInfoField label={t('properties.detail.property_type')} value={detailObj?.property_type || ''} />
            <IInfoField label={t('properties.detail.bedrooms')} value={detailObj?.bedrooms || ''} />
            <IInfoField label={t('properties.detail.market_value')} value={detailObj?.price || ''} valueClass="text-primary" />
            <IInfoField label={t('properties.detail.monthly_rent')} value={detailObj?.monthly_rent || ''} />
          </div>

          <div className="rounded-lg bg-background-secondary p-6 space-y-2">
            <div className="text-4.5">{t('properties.detail.return')}</div>
            <div className="text-7.5 text-primary">
              {detailObj?.expected_annual_return}
              %
            </div>
            <div className="text-4 text-[#898989]">
              {t('properties.detail.including')}
              {detailObj?.expected_annual_return}
              %
              {' '}
              {t('properties.detail.rental')}
              {detailObj?.capital_appreciation}
              %
              {' '}
              {t('properties.detail.capital')}
            </div>

            <div className="fbc pt-4">
              <div className="text-4.5">
                {t('properties.detail.calculator')}
                {' '}
              </div>
              <div className="text-4 text-[#898989]">{t('properties.detail.average')}</div>
            </div>

            <div>
              <Input
                className="bg-background! text-text! [&>input]:(placeholder-text-[#898989])"
                size="large"
                placeholder={t('properties.detail.amount_placeholder')}
                suffix="GBP"
                onChange={e => setInvestmentPrice(Number(e.target.value))}
              />
            </div>

            <div className="fbc">
              <IInfoField
                className="space-y-2"
                labelClass="text-[#898989]"
                label={t('properties.detail.return')}
                value={annualReturn}
              />
              <IInfoField
                className="space-y-2"
                labelClass="text-[#898989]"
                label={t('properties.detail.ratio')}
                value={`${ratioNum.toFixed(2)}%`}
              />
            </div>

            <div>
              <Button
                type="primary"
                size="large"
                className="w-full text-black!"
                onClick={() => {
                  setAssetObj(detailObj || {})
                  navigate({
                    to: '/properties/payment'
                  })
                }}
              >
                {t('properties.detail.invest')}
              </Button>
            </div>
          </div>
        </div>

        <PropertyDescriptionCard location={detailObj?.location || ''} />

        <LocationCard />
      </div>

      <div className="space-y-4">
        <div className="text-5">{t('properties.detail.market_analysis')}</div>

        <div className="grid grid-cols-1 w-full gap-8 md:grid-cols-2">
          <div>
            <RegionalPriceTrendsCard />
          </div>
          <div>
            <RentalIncomeAnalysisCard />
          </div>
        </div>
      </div>
    </div>
  )
}
