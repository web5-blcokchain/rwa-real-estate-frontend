import type { DetailResponse } from '@/api/basicApi'
import apiBasic from '@/api/basicApi'
import { CollectButton } from '@/components/common/collect-button'
import { IInfoField } from '@/components/common/i-info-field'
import { useCommonDataStore } from '@/stores/common-data'
import { joinImagesPath } from '@/utils/url'
import { getContractBalance } from '@/utils/web3'
import { usePrivy } from '@privy-io/react-auth'
import { useQuery } from '@tanstack/react-query'
import { createLazyFileRoute, useMatch, useNavigate } from '@tanstack/react-router'
import { Button, Image, InputNumber } from 'antd'
import numbro from 'numbro'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { LocationCard } from './-cards/location'
import { PropertyDescriptionCard } from './-cards/property-description'
import { RegionalPriceTrendsCard } from './-cards/regional-price-trends'
import { RentalIncomeAnalysisCard } from './-cards/rental-income-analysis'
import './index.scss'

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

  // const [annualReturn, setAnnualReturn] = useState<number>(0)
  const [ratioNum, setRatioNum] = useState<number>(0)
  const [isCollect, setIsCollect] = useState<0 | 1>(0)
  const [, setContractBalance] = useState<string>('0')
  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewCurrent, setPreviewCurrent] = useState(0)

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

    // const monthlyRent = Number(assetDetail.monthly_rent) // 每月租金
    // const expectedAnnualReturn = Number(assetDetail.expected_annual_return) // 预期年回报率
    // const price = Number(assetDetail.price)
    // const capitalAppreciation = Number(assetDetail.capital_appreciation)

    // const rentalNum = monthlyRent * expectedAnnualReturn / 100
    // const capitalNum = price * capitalAppreciation / 100
    // const annualReturnValue = (rentalNum + capitalNum) * 12

    // setAnnualReturn(annualReturnValue)
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

  const [investmentAmount, setInvestmentAmount] = useState<number>()

  return (
    <div className="px-12 space-y-8 max-lg:px-4">
      <Waiting
        for={!isLoading}
        className="h-32 fcc"
        iconClass="size-8"
      >

        <div className="space-y-4">
          <div className="relative w-full flex flex-col gap-8 b-b-1 b-b-#848E9C">
            {imageList.length > 0 && (
              <div className="relative w-full">
                <button
                  className="absolute left-4 top-4 z-10 rounded-5 bg-#181A20 px-2.5 text-base"
                  onClick={() => {
                    setPreviewVisible(true)
                    setPreviewCurrent(0)
                  }}
                >
                  查看全部图片
                </button>
                {/* <ImageSwiper list={imageList} /> */}
                <Image.PreviewGroup
                  items={imageList}
                  preview={{
                    visible: previewVisible,
                    current: previewCurrent,
                    onVisibleChange: vis => setPreviewVisible(vis),
                    onChange: current => setPreviewCurrent(current)
                  }}
                >
                  <img className="max-h-128 w-full" src={imageList[0]} alt="" />
                </Image.PreviewGroup>
                <div className="absolute right-4 top-4">
                  <CollectButton
                    className=""
                    houseId={assetId}
                    collect={isCollect}
                  />
                </div>
              </div>
            )}

            <div>
              <div className="fb gap-4">
                <div className="space-y-4">
                  <div className="text-6">{assetDetail?.name}</div>
                  <div className="text-4">{assetDetail?.address}</div>
                </div>

                <div className="pr">

                </div>
              </div>

              <div className="my-4 flex gap-2 overflow-hidden max-lg:flex-col">
                <div className="w-fit truncate rounded-6px bg-#848E9C px-2.5 text-18px max-lg:max-w-full">
                  {t('properties.detail.property_type')}
                  :
                  {assetDetail?.property_type || ''}
                </div>
                <div className="w-fit truncate rounded-6px bg-#848E9C px-2.5 text-18px max-lg:max-w-full">
                  {t('properties.detail.bedrooms')}
                  :
                  {assetDetail?.bedrooms || ''}
                </div>
              </div>

              <div className="mb-4 w-fit flex flex-col text-16px max-lg:text-14px">
                {/* <IInfoField label={t('properties.detail.property_type')} value={assetDetail?.property_type || ''} />
              <IInfoField label={t('properties.detail.bedrooms')} value={assetDetail?.bedrooms || ''} /> */}
                <IInfoField
                  horizontal
                  label={t('properties.detail.market_value')}
                  value={assetDetail?.price || ''}
                  className="gap-4"
                />
                <IInfoField className="gap-4" horizontal label={t('properties.detail.monthly_rent')} value={assetDetail?.monthly_rent || ''} />
              </div>

            </div>
            <div className="absolute bottom-6 right-0 rounded-lg bg-#F0B90B px-6 py-18px text-black max-lg:relative space-y-2">
              <div>
                <div className="text-4.5 font-bold">{t('properties.detail.return')}</div>
                <div className="text-10 font-bold max-lg:text-7.5">
                  {assetDetail?.expected_annual_return}
                  %
                </div>
                <div className="text-4">
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
              </div>

              <div>
                <div className="mb-2 flex justify-between text-18px max-lg:text-16px">
                  <div>{t('properties.detail.invest_calculator')}</div>
                  <div>{t('properties.detail.average_days', { n: 30 })}</div>
                </div>
                <InputNumber
                  value={investmentAmount}
                  controls={false}
                  onChange={e => setInvestmentAmount(e || 0)}
                  className="computed-input w-510px max-lg:w-full !b-#484D56 !bg-transparent !text-#484D56"
                  placeholder={t('properties.detail.invest_calculator_placeholder')}
                  suffix="GBP"
                />
              </div>

              <div className="fyc">
                <IInfoField
                  className="flex-1 space-y-2"
                  labelClass="text-black"
                  label={t('properties.detail.return')}
                  value={numbro(Number(assetDetail?.expected_annual_return) * (investmentAmount || 0)).format({ thousandSeparated: true, mantissa: (investmentAmount ? 2 : 0) })}
                />
                <IInfoField
                  className="flex-1 space-y-2"
                  labelClass="text-black"
                  label={t('properties.detail.ratio')}
                  value={`${ratioNum.toFixed(2)}%`}
                />
              </div>

              <div>
                <Button
                  size="large"
                  className="w-full bg-#181A20 text-#F0B90B!"
                  onClick={() => {
                    toInvest(assetId, assetDetail!)
                  }}
                >
                  {t('properties.detail.invest')}
                </Button>
              </div>
            </div>

          </div>
          <PropertyDescriptionCard className="px-0 !bg-transparent max-lg:px-0" location={assetDetail?.location || ''} />

          <LocationCard className="w-529px px-0 max-lg:w-full !bg-transparent max-lg:px-0" />
          <div className="text-5">{t('properties.detail.market_analysis')}</div>

          <div className="grid grid-cols-1 w-full gap-8 md:grid-cols-2">
            <div>
              <RegionalPriceTrendsCard className="!bg-transparent" />
            </div>
            <div>
              <RentalIncomeAnalysisCard className="!bg-transparent" />
            </div>
          </div>
        </div>
      </Waiting>
    </div>
  )
}
