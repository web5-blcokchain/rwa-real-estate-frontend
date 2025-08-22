import apiBasic from '@/api/basicApi'
import explanation3 from '@/assets/icons/exchange.svg'
import explanation1 from '@/assets/icons/pie-chart-white.svg'
import explanation2 from '@/assets/icons/shield.svg'
import coinType1 from '@/assets/images/home/coin-type-1.png'
import coinType2 from '@/assets/images/home/coin-type-2.png'
import coinType3 from '@/assets/images/home/coin-type-3.png'
import introduction1 from '@/assets/images/home/introduction-1.png'
import introduction2 from '@/assets/images/home/introduction-2.png'
import introduction3 from '@/assets/images/home/introduction-3.png'
import introduction4 from '@/assets/images/home/introduction-4.png'
import FeatureCard from '@/components/home/feature-card'
import { NewsList } from '@/components/news/newsList'
import { useCommonDataStore } from '@/stores/common-data'
import { joinImagesPath } from '@/utils/url'
import { useQuery } from '@tanstack/react-query'
import { createLazyFileRoute, useNavigate } from '@tanstack/react-router'
import './index.scss'

export const Route = createLazyFileRoute('/_app/home/')({
  component: RouteComponent
})

function RouteComponent() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const commonData = useCommonDataStore()

  const {
    data: propertieList,
    isLoading: propertieLoading
  } = useQuery({
    queryKey: ['properties', 1],
    queryFn: async () => {
      const res = await apiBasic.getDataList({ page: 1 })
      const list = _get(res.data, 'list', []) as any[]
      return list
    }
  })

  const [headerH, setHeaderH] = useState(0)
  useEffect(() => {
    setHeaderH(document.querySelector('header')?.getBoundingClientRect()?.height || 0)
  }, [])

  const coinTypes = [
    { img: coinType1, url: '' },
    { img: coinType2, url: '' },
    { img: coinType3, url: '' }
  ]
  const coinStatus = [
    { title: 'home.statistics.totalVolume', content: '4.25B' },
    { title: 'home.statistics.activeInvestors', content: '12.450+' },
    { title: 'home.statistics.tokenizedProperties', content: '85' },
    { title: 'home.statistics.annualYield', content: '8.2%' }
  ]
  const coinExplanation = [
    { icon: explanation1, title: 'home.investmentFeature.ownership', content: 'home.investmentFeature.lowEntry' },
    { icon: explanation2, title: 'home.investmentFeature.compliance', content: 'home.investmentFeature.kyc' },
    { icon: explanation3, title: 'home.investmentFeature.liquidity', content: 'home.investmentFeature.secondaryMarket' }
  ]

  const introductionList = [
    { title: 'home.investorGuide.zeroDown', content: 'home.investorGuide.groupBuy', img: introduction1 },
    { title: 'home.investorGuide.rentAndAppreciate', content: 'home.investorGuide.dailyRent', img: introduction2 },
    { title: 'home.investorGuide.rentNoWorry', content: 'home.investorGuide.autoManage', img: introduction3 },
    { title: 'home.investorGuide.control', content: 'home.investorGuide.flexibleInvest', img: introduction4 }
  ]

  // async function getNewsList() {
  //   const newsTypeId = newsType?.list[Number(activeKey)].id
  //   return await getNews({ type_id: newsTypeId! })
  // }
  // const { data: news, isFetching: newsLoading } = useQuery({
  //   queryKey: ['getNews', activeKey],
  //   retry: 3,
  //   queryFn: async () => {
  //     const data = await getNews({ type_id: newsTypeId! })
  //     return data.data
  //   },
  //   enabled: !!activeKey
  // })

  return (
    <div className="" style={{ '--conent-h': `${headerH || 80}px` } as any}>
      <div
        className="home-content fxc flex-col pl-[118px] max-lg:py-9 max-lg:pl-[24px] max-md:pl-4 max-xl:pl-[60px] max-lg:!h-fit"
      >
        <div
          className={cn('3xl:text-[100px] 3xl:leading-[113px]  text-[70px] leading-[90px]', `w-50% max-lg:text-[48px] max-md:text-22px max-xl:text-[62px] 
            max-lg:leading-[64px] max-md:leading-32px max-xl:leading-[80px]`)}
        >
          {t('home.explanation.title')}
        </div>

        <div
          className="mt-[97px] w-55% flex flex-col gap-[33px] max-lg:mt-[60px] max-md:mt-30px max-xl:mt-[80px] max-lg:gap-[28px] max-md:gap-22px max-xl:gap-[30px]"
        >
          <div
            className="text-[28px] leading-[42px] 3xl:text-[36px] max-lg:text-[20px] max-md:text-10px xl:text-[24px] max-lg:leading-[30px] max-md:leading-15px max-xl:leading-[36px]"
          >
            {t('home.explanation.content')}
          </div>

          <button
            className="h-[46px] w-fit fcc gap-[5px] bg-[#F0B90B] px-[30px] text-center text-[16px] text-black max-lg:h-[42px] max-md:h-18px max-xl:h-[44px] max-lg:px-[15px] max-xl:px-[20px] max-lg:text-[12px] max-md:text-10px max-xl:text-[14px]"
          >
            <span>{t('home.explanation.button')}</span>
            <div
              className="i-si-arrow-right-duotone h-[30px] w-[30px] bg-black max-lg:h-[24px] max-lg:w-[24px] max-md:h-3 max-md:w-3 max-xl:h-[26px] max-xl:w-[26px]"
            />
          </button>
        </div>
      </div>

      <div className="fccc gap-124px px-120px pb-150px pt-96px max-lg:gap-48px max-md:gap-22px max-xl:gap-80px max-lg:px-32px max-md:px-3 max-xl:px-40px max-lg:pb-60px max-lg:pt-36px max-md:pb-7px max-md:pt-16px max-xl:pb-100px max-xl:pt-60px">
        <div className="fccc gap-10 max-lg:gap-5 max-md:gap-13px max-xl:gap-7">
          <div className="fccc gap-14px max-md:gap-0 max-xl:gap-10px">
            <div className="text-36px font-500 leading-10 max-lg:text-20px max-md:text-4 max-xl:text-28px max-lg:leading-6 max-md:leading-6 max-xl:leading-8">{t('home.rwaType.rwaTitle')}</div>
            <div className="text-center text-22px leading-26px max-lg:text-14px max-md:text-10px max-xl:text-18px max-lg:leading-18px max-md:leading-14px max-xl:leading-22px">{t('home.rwaType.rwaDesc')}</div>
          </div>
          <div className="grid grid-cols-3 gap-30px max-lg:grid-cols-2 max-lg:gap-16px max-md:gap-11px max-xl:gap-18px">
            {
              coinTypes.map((item, index) => (
                <div key={index} className={cn('flex flex-col items-center rounded-5 cursor-pointer bg-#1f2328 max-lg:rounded-2 max-xl:rounded-3', index === 2 && 'max-lg:hidden')}>
                  <img src={item.img} alt="" className="w-full" />
                  <div className="h-full w-full flex flex-col justify-between px-5 pb-33px pt-5 max-lg:px-2 max-md:px-6px max-xl:px-3 max-lg:pb-10px max-lg:pt-2 max-md:pb-9px max-md:pt-6px max-xl:pb-18px max-xl:pt-3">
                    <div>
                      <div className="text-[22px] font-500 leading-6 max-lg:text-[16px] max-md:text-[10px] max-xl:text-[22px] max-lg:leading-6 max-md:leading-3">
                        {t(`home.rwaType.coinTypes.title-${index + 1}`)}
                      </div>
                      <div className="mb-4 mt-2 text-[16px] text-#a7a9ad leading-7 max-lg:mb-2 max-lg:mt-1 max-md:mb-5px max-md:mt-2px max-xl:mb-4 max-xl:mt-2 max-lg:text-[12px] max-md:text-2 max-xl:text-[16px] max-lg:leading-5 max-md:leading-3">
                        {t(`home.rwaType.coinTypes.content-${index + 1}`)}
                      </div>
                    </div>
                    <div
                      onClick={() => window.open(item.url, '_blank')}
                      className="fyc gap-5px text-18px font-500 leading-10 max-lg:gap-2px max-md:gap-2px max-xl:gap-3px max-lg:text-14px max-md:text-6px max-xl:text-18px max-lg:leading-6 max-md:leading-10px"
                    >
                      <span>{t('home.explanation.button')}</span>
                      <div className="i-si-arrow-right-duotone h-30px w-30px bg-white max-lg:h-16px max-lg:w-16px max-md:h-a max-md:w-2 max-xl:h-22px max-xl:w-22px" />
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
        <div className="w-full flex justify-between gap-30px rounded-5 bg-#1f2328 px-50px pb-72px pt-53px max-lg:gap-10px max-xl:gap-18px max-lg:rounded-2 max-md:rounded-2 max-xl:rounded-3 max-lg:px-5 max-md:px-15px max-md:py-10px max-xl:px-20px max-lg:pb-18px max-lg:pt-16px max-xl:pb-36px max-xl:pt-30px">
          {
            coinStatus.map((item, index) => (
              <div key={index} className="fccc justify-between gap-6 text-center max-lg:gap-2 max-md:gap-0 max-xl:gap-3">
                <div className="text-6 leading-10 max-lg:text-2 max-md:text-2 max-xl:text-4 max-lg:leading-4">
                  {t(item.title)}
                </div>
                <div className="text-40px font-500 leading-10 max-lg:text-24px max-md:text-18px max-xl:text-40px">
                  {item.content}
                  {' '}
                  {index === 0 && commonData.payTokenName}
                </div>
              </div>
            ))
          }
        </div>
      </div>

      <div className="content-min-h home-explanation w-full fccc gap-11 pb-68px pl-125px pr-161px pt-93px text-center max-lg:gap-4 max-md:gap-4 max-xl:gap-7 max-lg:pb-24px max-lg:pl-12px max-lg:pr-12px max-lg:pt-32px max-md:pb-32px max-md:pl-14px max-md:pr-7 max-md:pt-12px max-xl:pb-40px max-xl:pl-40px max-xl:pr-40px max-xl:pt-60px !max-lg:min-h-auto">
        <div>
          <div className="text-36px font-500 leading-10 3xl:text-5xl max-lg:text-18px max-md:text-4 max-xl:text-28px max-lg:leading-6 max-md:leading-6 max-xl:leading-8">{t('home.investmentFeature.frictionless')}</div>
          <div className="pt-14px text-22px font-500 leading-10 max-md:pt-0 3xl:text-26px max-lg:text-14px max-md:text-10px max-xl:text-18px max-lg:leading-5 max-md:leading-4 max-xl:leading-7">{t('home.investmentFeature.anyone')}</div>
        </div>
        <div className="w-full fyc justify-between">
          <div className="flex flex-col gap-11 max-lg:gap-3 max-md:gap-1 max-xl:gap-6">
            {coinExplanation.map((item, index) => (
              <div key={index} className="">
                <div className="fyc gap-7px max-lg:gap-1px max-xl:gap-3px">
                  <img className={cn('3xl:size-14 size-10 max-xl:size-8 max-lg:size-6 max-md:size-10px')} src={item.icon} />
                  <div className="text-24px font-500 leading-10 3xl:text-3xl max-lg:text-16px max-md:text-10px max-xl:text-20px max-lg:leading-5 max-md:leading-6 max-xl:leading-7">
                    {t(item.title)}
                  </div>
                </div>
                <div className="mt-3 w-490px text-left text-20px text-#a7a9ad leading-7 max-md:mt-1 3xl:w-600px max-lg:w-180px max-xl:w-320px 3xl:text-26px max-lg:text-12px max-md:text-8px max-xl:text-14px 3xl:leading-32px max-lg:leading-3 max-xl:leading-5">
                  {t(item.content)}
                </div>
              </div>
            ))}
          </div>
          <div className="fyc cursor-pointer gap-4 text-6 font-500 leading-10 max-lg:text-3 max-lg:text-4 max-xl:text-6 max-lg:leading-5 max-lg:leading-5 max-xl:leading-7">
            <div className="i-solar:play-circle-linear size-11 bg-white max-lg:size-6 max-md:size-14px max-xl:size-8"></div>
            <div>{t('home.investmentFeature.video')}</div>
          </div>
        </div>
      </div>

      <div className="px-30 max-lg:px-12 max-md:px-3 max-xl:px-16">
        <div className="fccc gap-11 pt-120px max-lg:gap-6 max-md:gap-0 max-xl:gap-8 max-2xl:pt-86px max-lg:pt-40px max-md:pt-6 max-xl:pt-64px max-lg:!min-h-auto">
          <div className="fccc text-center font-500 leading-10 max-lg:text-5 max-xl:text-7 max-lg:leading-7 max-xl:leading-8">
            <div className="text-36px font-500 leading-10 max-lg:text-20px max-md:text-4 max-xl:text-28px max-lg:leading-6 max-md:leading-6 max-xl:leading-8">{t('home.earn.title')}</div>
            <div className="pt-14px text-22px leading-26px max-md:pt-0 max-lg:text-14px max-md:text-10px max-xl:text-18px">{t('home.earn.content')}</div>
          </div>
          <div className="w-full">
            <Waiting
              for={!propertieLoading}
              className="fcc"
              iconClass="size-8 max-xl:size-6 max-lg:size-5"
            >
              <div className="grid grid-cols-3 mt-8 gap-7 max-lg:grid-cols-2 max-lg:mt-4 max-xl:mt-6 max-lg:gap-3 max-xl:gap-5">
                {
                  propertieList && Array.from({ length: Math.min(4, propertieList.length) }).map((_, index) => {
                    const card = propertieList[index]
                    // if (!card || !card.image_urls)
                    //   return null
                    const [picture] = (!card || !card.image_urls) ? [''] : joinImagesPath(card.image_urls)
                    return (
                      <FeatureCard
                        key={card?.id || ''}
                        picture={picture}
                        title={card?.name || ''}
                        location={card?.address || ''}
                        price={card?.price || ''}
                        house_life={card?.house_life || ''}
                        bedrooms={card?.bedrooms || ''}
                        className={cn('select-none clickable-99 max-lg:flex w-full', index === 3 && 'hidden')}
                        onClick={() => {
                          navigate({
                            to: '/properties/detail/$id',
                            params: {
                              id: card?.id || ''
                            }
                          })
                        }}
                      />
                    )
                  })
                }
              </div>
            </Waiting>
          </div>
        </div>

        <div className="content-min-h fccc gap-50px pt-20 max-lg:gap-5 max-lg:gap-8 max-md:gap-14px max-xl:gap-8 max-xl:gap-8 max-md:pt-6 !max-lg:min-h-auto max-lg:!min-h-auto">
          <div className="fccc text-center leading-10 max-lg:leading-5 max-lg:leading-7 max-xl:leading-8">
            <div className="pb-14px text-36px font-500 leading-10 max-md:pb-0 max-lg:text-20px max-md:text-4 max-xl:text-28px max-lg:leading-6 max-md:leading-6 max-xl:leading-8">{t('home.investorGuide.newbieInvest')}</div>
            <div className="text-center text-22px leading-26px max-lg:text-14px max-md:text-10px max-xl:text-18px max-lg:leading-18px max-md:leading-14px max-xl:leading-22px">{t('home.investorGuide.getInfo')}</div>
          </div>
          <div className="grid grid-cols-2 gap-x-38px gap-y-50px max-md:gap-11px max-lg:gap-x-10px max-lg:gap-y-5 max-xl:gap-x-20px max-xl:gap-y-8">
            {
              introductionList.map((item, index) => (
                <div
                  className="flex justify-between gap-3 rounded-5 bg-#1f2328 pb-4 pl-33px pr-45px pt-54px max-lg:gap-1 max-md:gap-1 max-xl:gap-2 max-lg:rounded-2 max-lg:pl-10px max-lg:pr-12px max-lg:pt-20px max-md:pb-14px max-md:pl-10px max-md:pr-15px max-md:pt-14px max-xl:pl-20px max-xl:pr-28px max-xl:pt-36px"
                  key={item.title}
                >
                  <div className="flex-1 leading-8 max-lg:leading-7 max-md:leading-11px max-xl:leading-8">
                    <div className="text-24px max-lg:text-10px max-lg:text-16px max-xl:text-22px">{t(item.title)}</div>
                    <div className="mt-1 text-18px max-lg:text-12px max-lg:text-8px max-xl:text-16px">{t(item.content)}</div>
                  </div>
                  <div className={cn(index === 0 && 'w-164px h-161px max-xl:w-120px max-xl:h-120px max-lg:w-80px max-lg:h-80px max-md:w-46px max-md:h-45px', index === 1 && 'w-162px h-152px max-xl:w-120px max-xl:h-110px max-lg:w-80px max-lg:h-60px max-md:w-46px max-md:h-43px', index === 2 && 'w-184px h-177px max-xl:w-130px max-xl:h-120px max-lg:w-90px max-lg:h-80px max-md:w-52px max-md:h-49px', index === 3 && 'w-192px h-184px max-xl:w-140px max-xl:h-120px max-lg:w-100px max-lg:h-80px max-md:w-53px max-md:h-51px', 'max-w-auto "mt-31px flex items-end max-lg:mt-10px max-xl:mt-20px"')}>
                    <img
                      className={cn('max-w-auto,w-full')}
                      src={item.img}
                    />
                  </div>
                </div>
              ))
            }
          </div>
        </div>

        <div className="home-tables">
          <NewsList hasPagination={false} className="!px-0" />
        </div>
      </div>
    </div>
  )
}
