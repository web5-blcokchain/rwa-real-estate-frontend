import type { DetailResponse } from '@/api/basicApi'
import apiBasic from '@/api/basicApi'
import { CollectButton } from '@/components/common/collect-button'
import { IInfoField } from '@/components/common/i-info-field'
import { ImageSwiper } from '@/components/common/image-swiper'
import { useCommonDataStore } from '@/stores/common-data'
import { joinImagesPath } from '@/utils/url'
import { getContractBalance } from '@/utils/web3'
import { usePrivy } from '@privy-io/react-auth'
import { useQuery } from '@tanstack/react-query'
import { createLazyFileRoute, useMatch, useNavigate } from '@tanstack/react-router'
import { Button } from 'antd'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { LocationCard } from './-cards/location'
import { PropertyDescriptionCard } from './-cards/property-description'
import { RegionalPriceTrendsCard } from './-cards/regional-price-trends'
import { RentalIncomeAnalysisCard } from './-cards/rental-income-analysis'

export const Route = createLazyFileRoute('/_app/properties/detail/$id')({
  component: RouteComponent
})

function RouteComponent() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { params } = useMatch({
    from: '/_app/properties/detail/$id'
  })

  const assets = useCommonDataStore(state => state.assets)
  const assetId = Number.parseInt(params.id)

  const [annualReturn, setAnnualReturn] = useState<number>(0)
  const [ratioNum, setRatioNum] = useState<number>(0)
  const [isCollect, setIsCollect] = useState<0 | 1>(0)
  const [, setContractBalance] = useState<string>('0')

  const { data: assetDetail, isLoading } = useQuery<DetailResponse>({
    queryKey: ['property-detail', assetId],
    queryFn: async () => {
      const response = await apiBasic.getDataListDetail({ id: assetId })
      return response.data!
    }
  })

  useEffect(() => {
    if (!assetDetail)
      return

    const monthlyRent = Number(assetDetail.monthly_rent)
    const expectedAnnualReturn = Number(assetDetail.expected_annual_return)
    const price = Number(assetDetail.price)
    const capitalAppreciation = Number(assetDetail.capital_appreciation)

    const rentalNum = monthlyRent * expectedAnnualReturn / 100
    const capitalNum = price * capitalAppreciation / 100
    const annualReturnValue = (rentalNum + capitalNum) * 12

    setAnnualReturn(annualReturnValue)
    setRatioNum(20)
    setIsCollect(assetDetail.is_collect)
    // setRatioNum(Number(((investmentPrice * 12) / (rentalNum + capitalNum)) * 100))

    // 使用工具函数替换原代码
    if (assetDetail.contract_address) {
      getContractBalance(assetDetail.contract_address)
        .then((etherBalance) => {
          setContractBalance(etherBalance)
          console.log('合约余额:', etherBalance, 'ETH')
        })
    }
  }, [assetDetail])

  const imageList = joinImagesPath(assetDetail?.image_urls)
  const { authenticated } = usePrivy()
  function toInvest(assetId: number, assetDetail: DetailResponse | undefined) {
    if (!authenticated) {
      toast.error(t('header.error.login_required'))
      return
    }
    assets.set(assetId, assetDetail!)
    navigate({
      to: '/properties/payment/$id',
      params: { id: `${assetId}` }
    })
  }

  return (
    <div className="px-8 space-y-8">
      <Waiting
        for={!isLoading}
        className="h-32 fcc"
        iconClass="size-8"
      >

        <div className="grid grid-cols-1 w-full gap-8 md:grid-cols-2">
          {imageList.length > 0 && (
            <div>
              <ImageSwiper list={imageList} />
            </div>
          )}

          <div>
            <div className="fb gap-4 px-6">
              <div className="space-y-4">
                <div className="text-6">{assetDetail?.name}</div>
                <div className="text-4 text-[#d9d9d9]">{assetDetail?.address}</div>
              </div>

              <div className="pr">
                <CollectButton
                  houseId={assetId}
                  collect={isCollect}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 my-4 px-6">
              <IInfoField label={t('properties.detail.property_type')} value={assetDetail?.property_type || ''} />
              <IInfoField label={t('properties.detail.bedrooms')} value={assetDetail?.bedrooms || ''} />
              <IInfoField label={t('properties.detail.market_value')} value={assetDetail?.price || ''} valueClass="text-primary" />
              <IInfoField label={t('properties.detail.monthly_rent')} value={assetDetail?.monthly_rent || ''} />
            </div>

            <div className="rounded-lg bg-background-secondary p-6 space-y-2">
              <div className="text-4.5">{t('properties.detail.return')}</div>
              <div className="text-7.5 text-primary">
                {assetDetail?.expected_annual_return}
                %
              </div>
              <div className="text-4 text-[#898989]">
                {t('properties.detail.including')}
                {assetDetail?.expected_annual_return}
                %
                {' '}
                {t('properties.detail.rental')}
                {assetDetail?.capital_appreciation}
                %
                {' '}
                {t('properties.detail.capital')}
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
                    toInvest(assetId, assetDetail!)
                  }}
                >
                  {t('properties.detail.invest')}
                </Button>
              </div>
            </div>
          </div>

          <PropertyDescriptionCard location={assetDetail?.location || ''} />

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
      </Waiting>
    </div>
  )
}
