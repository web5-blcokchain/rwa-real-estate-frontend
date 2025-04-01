import type { DetailResponse, PriceTrendResponse } from '@/api/basicApi'
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
  const { data: trendData } = useQuery<PriceTrendResponse>({
    queryKey: ['detail', assetId],
    queryFn: async () => {
      const response = await apiBasic.getPriceTrend()
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
            <IInfoField label="Property Type" value={detailObj?.property_type || ''} />
            <IInfoField label="Bedrooms" value={detailObj?.bedrooms || ''} />
            <IInfoField label="Market Value" value={detailObj?.price || ''} valueClass="text-primary" />
            <IInfoField label="Monthly Rent" value={detailObj?.monthly_rent || ''} />
          </div>

          <div className="rounded-lg bg-background-secondary p-6 space-y-2">
            <div className="text-4.5">Expected Annual Return</div>
            <div className="text-7.5 text-primary">
              {detailObj?.expected_annual_return}
              %
            </div>
            <div className="text-4 text-[#898989]">
              Including
              {detailObj?.expected_annual_return}
              % rental yield and
              {detailObj?.capital_appreciation}
              % capital appreciation
            </div>

            <div className="fbc pt-4">
              <div className="text-4.5">Investment Calculator</div>
              <div className="text-4 text-[#898989]">Average 30-day</div>
            </div>

            <div>
              <Input
                className="bg-background! text-text! [&>input]:(placeholder-text-[#898989])"
                size="large"
                placeholder="Enter investment amount"
                suffix="GBP"
                onChange={e => setInvestmentPrice(Number(e.target.value))}
              />
            </div>

            <div className="fbc">
              <IInfoField
                className="space-y-2"
                labelClass="text-[#898989]"
                label="Expected Annual Return"
                value={annualReturn}
              />
              <IInfoField
                className="space-y-2"
                labelClass="text-[#898989]"
                label="Investment Ratio"
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
                Invest Now
              </Button>
            </div>
          </div>
        </div>

        <PropertyDescriptionCard />

        <LocationCard />
      </div>

      <div className="space-y-4">
        <div className="text-5">Market Analysis</div>

        <div className="grid grid-cols-1 w-full gap-8 md:grid-cols-2">
          <div>
            <RegionalPriceTrendsCard data={Array.isArray(trendData) ? trendData : []} />
          </div>
          <div>
            <RentalIncomeAnalysisCard />
          </div>
        </div>
      </div>
    </div>
  )
}
