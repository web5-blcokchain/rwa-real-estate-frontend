import type { DetailResponse } from '@/api/basicApi'
import apiBasic from '@/api/basicApi'
import { CollectButton } from '@/components/common/collect-button'
import { IInfoField } from '@/components/common/i-info-field'
import { ImageSwiper } from '@/components/common/image-swiper'
import { useCommonDataStore } from '@/stores/common-data'
import { formatNumberNoRound } from '@/utils/number'
import { joinImagesPath } from '@/utils/url'
import { usePrivy } from '@privy-io/react-auth'
import { useQuery } from '@tanstack/react-query'
import { createLazyFileRoute, useMatch, useNavigate } from '@tanstack/react-router'
import { Button, Image, InputNumber, Modal } from 'antd'
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
  // const [ratioNum, setRatioNum] = useState<number>(0)
  const [isCollect, setIsCollect] = useState<0 | 1>(0)
  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewCurrent, setPreviewCurrent] = useState(0)
  const commonData = useCommonDataStore()

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
    setIsCollect(assetDetail.is_collect)
  }, [assetDetail])

  const imageList = joinImagesPath(assetDetail?.image_urls)
  const { authenticated } = usePrivy()
  function toInvest(assetId: number, assetDetail: DetailResponse | undefined) {
    if (assetDetail?.market_status !== 1) {
      toast.warn(t('properties.detail.invest_warn') + t(`properties.detail.status.${assetDetail?.market_status}`))
      return
    }
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
  const [open, setOpen] = useState(false)

  const detailRatio = useMemo(() => {
    return formatNumberNoRound((investmentAmount || 0) / Number(assetDetail?.price || 0) / Number(assetDetail?.Inception_number || 0) * 100, 6)
  }, [investmentAmount, assetDetail])

  const maxBuyNum = useMemo(() => {
    return Number(assetDetail?.Inception_number || 0) * Number(assetDetail?.price || 0)
  }, [assetDetail])
  const divRef = useRef<HTMLDivElement>(null)
  const fiexedContent = useRef<HTMLDivElement>(null)
  const [fiexedContentFunc, setFiexedContentFunc] = useState({
    observer: null as MutationObserver | null
  })
  useEffect(() => {
    const handleScroll = async () => {
      if (!divRef.current || !fiexedContent.current)
        return
      await new Promise(resolve => setTimeout(resolve, 50))
      const parentY = (divRef.current?.getBoundingClientRect().height || 0) + (divRef.current?.offsetTop || 0)
      const parentX = divRef.current?.getBoundingClientRect().x || 0
      const parentHeight = divRef.current?.offsetHeight || 0
      const parentWidth = divRef.current?.offsetWidth || 0
      let contentY = parentY + parentHeight - 20
      const contentX = parentX + parentWidth
      contentY = Math.min(contentY, window.innerHeight - 20)

      if (fiexedContent.current) {
        fiexedContent.current.style.top = `${contentY}px`
        fiexedContent.current.style.left = `${contentX}px`
        fiexedContent.current.style.transform = 'translate(-100%,-100%)'
      }
    }
    // 每次进入函数的时候，删除之前的窗口事件和监听
    window.removeEventListener('resize', handleScroll)
    fiexedContentFunc.observer?.disconnect()
    const observer = new MutationObserver(handleScroll)
    if (divRef.current) {
      observer.observe(divRef.current, { attributes: true, childList: true, subtree: true })
    }
    handleScroll()
    setFiexedContentFunc({
      observer
    })
    window.addEventListener('resize', handleScroll)
    return () => {
      window.removeEventListener('resize', handleScroll)
      observer.disconnect()
    }
  }, [divRef, assetDetail])

  return (
    <div className="header-padding space-y-8">
      <Waiting
        for={!isLoading}
        className="h-32 fcc"
        iconClass="size-8"
      >

        <div className="properties-content space-y-4">
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
                  {t('common.all_images')}
                </button>
                <ImageSwiper navigation list={imageList} />
                <Image.PreviewGroup
                  items={imageList}
                  preview={{
                    visible: previewVisible,
                    current: previewCurrent,
                    onVisibleChange: vis => setPreviewVisible(vis),
                    onChange: current => setPreviewCurrent(current)
                  }}
                >
                  {/* <img className="max-h-128 w-full" src={imageList[0]} alt="" /> */}
                </Image.PreviewGroup>
                <div className="absolute right-4 top-4 z2">
                  <CollectButton
                    className=""
                    houseId={assetId}
                    collect={isCollect}
                  />
                </div>
              </div>
            )}

            <div ref={divRef}>
              <div className="max-w-50% fb gap-4 pr-3 max-lg:max-w-full max-lg:pr-0">
                <div className="space-y-4">
                  <div className="text-6">{assetDetail?.name}</div>
                  <div className="text-4">{assetDetail?.address}</div>
                </div>

                <div className="pr">

                </div>
              </div>

              <div className="my-4 flex gap-2 overflow-hidden max-lg:flex-col">
                <div className="w-fit truncate rounded-6px bg-#848E9C px-2.5 text-18px max-lg:max-w-full max-md:text-16px">
                  {t('properties.detail.property_type')}
                  :
                  {assetDetail?.property_type || ''}
                </div>
                <div className="w-fit truncate rounded-6px bg-#848E9C px-2.5 text-18px max-lg:max-w-full max-md:text-16px">
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
                  value={`${assetDetail?.price || ''} ${commonData.payTokenName}`}
                  className="gap-4"
                />
                <IInfoField
                  className="gap-4"
                  horizontal
                  label={t('properties.detail.monthly_rent')}
                  value={`${assetDetail?.monthly_rent || ''}`}
                />
              </div>

            </div>
            <div
              ref={fiexedContent}
              className="fixed left-90% top-78% z-10 max-w-50% rounded-lg bg-#F0B90B px-6 py-18px text-black max-lg:relative max-lg:max-w-full space-y-2 max-lg:left-0! max-lg:transform-translate-[0]! max-lg:-top-20px!"
            >
              <div>
                <div className="text-4.5 font-bold max-md:text-16px">{t('properties.detail.return')}</div>
                <div className="text-10 font-bold max-lg:text-7.5">
                  {assetDetail?.expected_annual_return}
                  %
                </div>
                <div className="text-4">
                  {t('properties.detail.return_range', { max: `${Number(assetDetail?.annual_return_max || 0)}%`, min: `${Number(assetDetail?.annual_return_min || 0)}%` })}
                </div>
              </div>

              <div>
                <div className="mb-2 flex justify-between text-18px max-lg:text-16px">
                  <div>{t('properties.detail.invest_calculator')}</div>
                  {/* <div>{t('properties.detail.average_days', { n: 30 })}</div> */}
                </div>
                <InputNumber
                  max={maxBuyNum}
                  value={investmentAmount}
                  controls={false}
                  onChange={e => setInvestmentAmount(e || 0)}
                  className="computed-input max-w-full w-510px max-lg:w-full !b-#484D56 !bg-transparent !text-#484D56"
                  placeholder={t('properties.detail.invest_calculator_placeholder')}
                  suffix="USDT/USDC" // coinSymbol || assetDetail?.token_symbol ||
                />
              </div>

              <div className="fyc">
                <IInfoField
                  className="flex-1 space-y-2"
                  labelClass="text-black"
                  label={t('properties.detail.return')}
                  value={`${formatNumberNoRound((Number(assetDetail?.expected_annual_return) * (investmentAmount || 0) / 100), 6, 0, {
                    thousandSeparated: true
                  })} ${commonData.payTokenName}`}
                />
                <IInfoField
                  className="flex-1 space-y-2"
                  labelClass="text-black"
                  label={t('properties.detail.ratio')}
                  value={`${detailRatio}%`}
                />
                {/* <IInfoField
                  className="flex-1 space-y-2"
                  labelClass="text-black"
                  label={t('properties.detail.annual_return_max')}
                  value={`${Number(assetDetail?.annual_return_max || 0)}%`}
                /> */}
              </div>

              <div>
                <Button
                  // disabled={assetDetail?.market_status !== 1}
                  size="large"
                  className="w-full bg-#181A20 text-#F0B90B!"
                  onClick={() => {
                    toInvest(assetId, assetDetail!)
                  }}
                >
                  {t(assetDetail?.market_status === 1 ? 'properties.detail.invest' : `properties.detail.status.${assetDetail?.market_status}`)}
                </Button>
              </div>
              <div className="fyc cursor-pointer gap-1 text-sm" onClick={() => setOpen(true)}>
                <div>{t('properties.detail.lock_period')}</div>
                <div className="i-carbon-warning size-4 bg-black leading-4"></div>
              </div>
            </div>

          </div>
          <PropertyDescriptionCard className="px-0 !bg-transparent max-lg:px-0" location={assetDetail?.property_description || ''} />
          <div className='max-lg:px-0" p-6 px-0'>
            <div className="text-5">{t('properties.detail.location_description')}</div>
            <div className="mt-4 text-[#d9d9d9]">
              {assetDetail?.location}
            </div>
          </div>
          <LocationCard className="w-529px px-0 max-lg:w-full !bg-transparent max-lg:px-0" Longitude={assetDetail?.longitude || ''} Latitude={assetDetail?.latitude || ''} />

          <div className="p-6 px-0 max-lg:px-0">
            <div className="text-5">{t('properties.detail.market_analysis')}</div>

            <div className="grid grid-cols-1 mt-4 w-full gap-8 md:grid-cols-2">
              <div>
                <RegionalPriceTrendsCard className="!bg-transparent" />
              </div>
              <div>
                <RentalIncomeAnalysisCard className="!bg-transparent" />
              </div>
            </div>
          </div>
          {/* 锁定期弹窗 */}
          <Modal
            className="[&>div>.ant-modal-content]:!bg-background"
            // closeIcon={false}
            centered
            width={968}
            onCancel={() => setOpen(false)}
            open={open}
            footer={null}
          >
            <div className="">
              <div className="mb-6 text-2xl">{t('properties.detail.lock_period_title')}</div>
              <div className="text-base">{t('properties.detail.lock_period_content')}</div>
              <ul className="mt-2 list-disc text-sm [&>li]:ml-4 space-y-1">
                <li>{t('properties.detail.lock_period_content_1')}</li>
                <li>{t('properties.detail.lock_period_content_2')}</li>
                <li>{t('properties.detail.lock_period_content_3')}</li>
                <li>{t('properties.detail.lock_period_content_4')}</li>
              </ul>
            </div>
          </Modal>
        </div>
      </Waiting>
    </div>
  )
}
