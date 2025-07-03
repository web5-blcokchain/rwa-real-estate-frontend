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
import Card from '@/components/home/card'

import FeatureCard from '@/components/home/feature-card'
import { joinImagesPath } from '@/utils/url'
import { useQuery } from '@tanstack/react-query'
import { createLazyFileRoute, useNavigate } from '@tanstack/react-router'
import { ConfigProvider, Tabs } from 'antd'
import './index.scss'

export const Route = createLazyFileRoute('/_app/home/')({
  component: RouteComponent
})

function RouteComponent() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const {
    data: propertieList,
    isLoading: propertieLoading
  } = useQuery({
    queryKey: ['properties', 1],
    queryFn: async () => {
      const res = await apiBasic.getDataList({ page: 1 })
      const list = _get(res.data, 'list', []) as any[]
      return list.slice(0, 3)
    }
  })

  const cards = [
    {
      icon: 'pie-chart',
      title: `${t('home.route.ownership')}`,
      content: `${t('home.route.ownership_content')}`
    },
    {
      icon: 'security',
      title: `${t('home.route.compliance')}`,
      content: `${t('home.route.compliance_content')}`
    },
    {
      icon: 'double-arrow',
      title: `${t('home.route.investment')}`,
      content: `${t('home.route.investment_content')}`
    }
  ]

  const howItWorks = [
    {
      icon: 'create-account',
      title: `${t('home.works.step1_title')}`,
      content: `${t('home.works.step1_content')}`
    },
    {
      icon: 'building',
      title: `${t('home.works.step2_title')}`,
      content: `${t('home.works.step2_content')}`
    },
    {
      icon: 'currency',
      title: `${t('home.works.step3_title')}`,
      content: `${t('home.works.step3_content')}`
    },
    {
      icon: 'create-account',
      title: `${t('home.works.step4_title')}`,
      content: `${t('home.works.step4_content')}`
    }
  ]

  const [headerH, setHeaderH] = useState(0)
  useEffect(() => {
    setHeaderH(document.querySelector('header')?.getBoundingClientRect()?.height || 0)
  }, [])

  const coinTypes = [
    { title: 'RWA铸稳系统', content: '真实世界资产抵押型稳定币发行机制', img: coinType1, url: '' },
    { title: 'RWA Coin领取收益', content: '将RWA资产产生的现金流自动或手动分配给代币持有者', img: coinType2, url: '' },
    { title: 'RWA Coin交易', content: '把现实世界的东西(比如国债、房子、黄金)变成区块链上的代币', img: coinType3, url: '' }
  ]
  const coinStatus = [
    { title: '总交易量', content: '$4.25B' },
    { title: '积极投资者', content: '12.450+' },
    { title: '标记化属性', content: '85' },
    { title: '年回报率', content: '8.2%' }
  ]
  const coinExplanation = [
    { icon: explanation1, title: '部分所有权', content: '以低至 100 美元的价格投资优质房地产在全球拥有一处高价值房产。' },
    { icon: explanation2, title: '法规遵从性', content: '具有强大 KYC/AML 程序的完全监管平台您的投资是安全且合规的。' },
    { icon: explanation3, title: '流动性投资', content: '在我们的二级市场上 24/7 全天候交易您的财产代币。房地产从来没有过的流动性。' }
  ]

  const introductionList = [
    { title: '0首付入股', content: '和别人一起合伙买房收租', img: introduction1 },
    { title: '躺着收租，转手涨价', content: '租金日结(不是每月或每季度)，卖房赚差价', img: introduction2 },
    { title: '躺着收租，还不用管琐事', content: '零操心当房东， 重要决定你来做，日常管理交给我', img: introduction3 },
    { title: '投资方向盘，永远在你手里', content: '租金想继续投资就投资，想卖房随时都能卖', img: introduction4 }
  ]

  return (
    <div className="">
      <div
        style={{ '--conent-h': `${headerH}px` } as any}
        className="home-content fxc flex-col pl-[118px] max-md:py-9 max-lg:pl-[24px] max-md:pl-2 max-xl:pl-[60px] max-md:!h-fit"
      >
        <div
          className="w-[700px] text-[100px] leading-[120px] max-lg:w-[500px] max-md:w-196px max-xl:w-[600px] max-lg:text-[48px] max-md:text-28px max-xl:text-[72px] max-lg:leading-[64px] max-md:leading-38px max-xl:leading-[90px]"
        >
          重新定义房地产的投资未来
        </div>

        <div
          className="mt-[97px] w-[521.5px] flex flex-col gap-[33px] max-lg:mt-[60px] max-md:mt-30px max-xl:mt-[80px] max-lg:w-[400px] max-md:w-[205px] max-xl:w-[460px] max-lg:gap-[28px] max-md:gap-22px max-xl:gap-[30px]"
        >
          <div
            className="text-[30px] leading-[42px] max-lg:text-[20px] max-md:text-10px max-xl:text-[24px] max-lg:leading-[30px] max-md:leading-15px max-xl:leading-[36px]"
          >
            将资产转化为全球可访问的金融工具，具有真正的加密原生效用
          </div>

          <button
            className="h-[46px] w-[139px] fcc gap-[5px] bg-[#F0B90B] text-center text-[16px] text-black max-lg:h-[42px] max-lg:w-[120px] max-md:h-18px max-md:w-66px max-xl:h-[44px] max-xl:w-[130px] max-lg:text-[12px] max-md:text-10px max-xl:text-[14px]"
          >
            <span>了解更多</span>
            <div
              className="i-si-arrow-right-duotone h-[30px] w-[30px] bg-black max-lg:h-[24px] max-lg:w-[24px] max-md:h-3 max-md:w-3 max-xl:h-[26px] max-xl:w-[26px]"
            />
          </button>
        </div>
      </div>

      <div className="fccc gap-124px px-120px pb-150px pt-96px max-lg:gap-48px max-md:gap-22px max-xl:gap-80px max-lg:px-32px max-md:px-2 max-xl:px-40px max-lg:pb-60px max-lg:pt-36px max-md:pb-7px max-md:pt-16px max-xl:pb-100px max-xl:pt-60px">
        <div className="fccc gap-10 max-lg:gap-5 max-md:gap-13px max-xl:gap-7">
          <div className="fccc gap-18px max-lg:gap-6 max-lg:gap-6px max-md:gap-0 max-xl:gap-10px">
            <div className="text-36px font-500 leading-10 max-lg:text-20px max-md:text-4 max-xl:text-28px">真实世界资产代币新模式</div>
            <div className="text-22px leading-26px max-lg:text-14px max-md:text-10px max-xl:text-18px">从机构级资产中交换、借出、借入、循环和赚取真实收益</div>
          </div>
          <div className="grid grid-cols-3 gap-30px max-lg:gap-16px max-md:gap-11px max-xl:gap-18px">
            {
              coinTypes.map((item, index) => (
                <div key={index} className="flex flex-col items-center rounded-5 bg-#1f2328 max-lg:rounded-2 max-xl:rounded-3">
                  <img src={item.img} alt="" className="w-full" />
                  <div className="h-full w-full flex flex-col justify-between px-5 pb-33px pt-5 max-lg:px-2 max-md:px-6px max-xl:px-3 max-lg:pb-10px max-lg:pt-2 max-md:pb-9px max-md:pt-6px max-xl:pb-18px max-xl:pt-3">
                    <div>
                      <div className="text-[30px] font-500 leading-10 max-lg:text-[16px] max-md:text-[10px] max-xl:text-[22px] max-lg:leading-6 max-md:leading-3">{item.title}</div>
                      <div className="mb-8 mt-3 text-[24px] text-#a7a9ad leading-7 max-lg:mb-2 max-lg:mt-1 max-md:mb-5px max-md:mt-2px max-xl:mb-4 max-xl:mt-2 max-lg:text-[12px] max-md:text-2 max-xl:text-[16px] max-lg:leading-5 max-md:leading-3">
                        {item.content}
                      </div>
                    </div>
                    <div onClick={() => window.open(item.url, '_blank')} className="fyc gap-5px text-26px font-500 leading-10 max-lg:gap-2px max-md:gap-2px max-xl:gap-3px max-lg:text-14px max-md:text-6px max-xl:text-18px max-lg:leading-6 max-md:leading-10px">
                      <span>了解详情</span>
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
              <div key={index} className="fccc gap-6 max-lg:gap-2 max-md:gap-0 max-xl:gap-3">
                <div className="text-6 leading-10 max-lg:text-2 max-md:text-2 max-xl:text-4 max-lg:leading-4">{item.title}</div>
                <div className="text-66px font-500 leading-10 max-lg:text-24px max-md:text-18px max-xl:text-40px">{item.content}</div>
              </div>
            ))
          }
        </div>
      </div>

      <div className="home-explanation w-full fccc gap-11 pb-68px pl-125px pr-161px pt-93px text-center max-lg:gap-4 max-md:gap-4 max-xl:gap-7 max-lg:pb-24px max-lg:pl-12px max-lg:pr-12px max-lg:pt-32px max-md:pb-32px max-md:pl-14px max-md:pr-7 max-md:pt-12px max-xl:pb-40px max-xl:pl-40px max-xl:pr-40px max-xl:pt-60px">
        <div>
          <div className="text-36px font-500 leading-10 max-lg:text-18px max-md:text-4 max-xl:text-28px max-lg:leading-6 max-md:leading-6 max-xl:leading-8">零碎和无摩擦的房地产投资</div>
          <div className="pt-14px text-26px font-500 leading-10 max-md:pt-0 max-lg:text-12px max-md:text-10px max-xl:text-18px max-lg:leading-5 max-md:leading-4 max-xl:leading-7">任何人都可以投资房地产-简单、实惠且无忧</div>
        </div>
        <div className="w-full fyc justify-between">
          <div className="flex flex-col gap-11 max-lg:gap-3 max-md:gap-1 max-xl:gap-6">
            {coinExplanation.map((item, index) => (
              <div key={index} className="">
                <div className="fyc gap-7px max-lg:gap-1px max-xl:gap-3px">
                  <img className={cn('size-10 max-xl:size-8 max-lg:size-6 max-md:size-10px', index === 1 && 'size-15 max-xl:size-10 max-lg:size-8 max-md:size-14px')} src={item.icon} />
                  <div className="text-30px font-500 leading-10 max-lg:text-14px max-md:text-10px max-xl:text-20px max-lg:leading-5 max-md:leading-6 max-xl:leading-7">{item.title}</div>
                </div>
                <div className="mt-3 w-490px text-left text-6 text-#a7a9ad leading-7 max-lg:w-180px max-xl:w-320px max-lg:text-2 max-xl:text-4 max-lg:leading-4 max-xl:leading-5">{item.content}</div>
              </div>
            ))}
          </div>
          <div className="fyc cursor-pointer gap-4 text-9 font-500 leading-10 max-lg:text-3 max-lg:text-4 max-xl:text-6 max-lg:leading-5 max-lg:leading-5 max-xl:leading-7">
            <div className="i-solar:play-circle-linear size-11 bg-white max-lg:size-6 max-md:size-14px max-xl:size-8"></div>
            <div>视频播放</div>
          </div>
        </div>
      </div>

      <div className="px-30 max-lg:px-12 max-md:px-2 max-xl:px-16">
        <div className="fccc gap-11 pt-86px max-lg:gap-6 max-md:gap-0 max-xl:gap-8 max-lg:pt-40px max-md:pt-6 max-xl:pt-64px">
          <div className="text-center font-500 leading-10 max-lg:text-5 max-xl:text-7 max-lg:leading-7 max-xl:leading-8">
            <div className="text-9 max-lg:text-5 max-md:text-4 max-xl:text-7 max-md:leading-100%">从RWA中赚取收益</div>
            <div className="text-26px max-lg:text-16px max-md:text-10px max-xl:text-20px max-lg:leading-6 max-md:leading-26px max-xl:leading-7">真实世界的资产仍然是您可以进行的最佳投资</div>
          </div>
          <div className="px-30 max-lg:px-12 max-md:px-2 max-xl:px-16">
            <Waiting
              for={!propertieLoading}
              className="fcc"
              iconClass="size-8 max-xl:size-6 max-lg:size-5"
            >
              <div className="grid grid-cols-3 mt-8 gap-7 max-lg:mt-4 max-xl:mt-6 max-lg:gap-3 max-xl:gap-5">
                {
                  propertieList && propertieList.map((card) => {
                    console.log(card)
                    const [picture] = joinImagesPath(card.image_urls)
                    return (
                      <FeatureCard
                        key={card.id}
                        picture={picture}
                        title={card.name}
                        location={card.address}
                        price={card.price}
                        house_life={card.house_life}
                        bedrooms={card.bedrooms}
                        className="select-none clickable-99"
                        onClick={() => {
                          navigate({
                            to: '/properties/detail/$id',
                            params: {
                              id: card.id
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

        <div className="fccc gap-50px pt-20 max-lg:gap-5 max-lg:gap-8 max-md:gap-14px max-xl:gap-8 max-xl:gap-8 max-md:pt-45px">
          <div className="text-center leading-10 max-lg:leading-5 max-lg:leading-7 max-xl:leading-8">
            <div className="pb-14px text-9 max-lg:pb-6px max-md:pb-2px max-xl:pb-10px max-lg:text-5 max-md:text-14px max-xl:text-7">就算你是新手，也能学老手那样投资</div>
            <div className="text-26px max-lg:text-16px max-md:text-10px max-xl:text-20px max-lg:leading-6 max-md:leading-5 max-xl:leading-7">马上获取超划算的房产买卖信息、专业分析，还能加入全球投资高手的交流圈子</div>
          </div>
          <div className="grid grid-cols-2 gap-x-38px gap-y-50px max-md:gap-11px max-lg:gap-x-10px max-lg:gap-y-5 max-xl:gap-x-20px max-xl:gap-y-8">
            {
              introductionList.map((item, index) => (
                <div
                  className="flex justify-between gap-3 rounded-5 bg-#1f2328 pb-4 pl-33px pr-45px pt-54px max-lg:gap-1 max-md:gap-1 max-xl:gap-2 max-lg:pl-10px max-lg:pr-12px max-lg:pt-20px max-md:pb-2px max-md:pl-10px max-md:pr-15px max-md:pt-14px max-xl:pl-20px max-xl:pr-28px max-xl:pt-36px"
                  key={item.title}
                >
                  <div className="leading-10 max-lg:leading-7 max-md:leading-11px max-xl:leading-8">
                    <div className="text-30px max-lg:text-10px max-lg:text-16px max-xl:text-22px">{item.title}</div>
                    <div className="text-22px max-lg:text-12px max-lg:text-8px max-xl:text-16px">{item.content}</div>
                  </div>
                  <div className="mt-31px flex items-end max-lg:mt-10px max-xl:mt-20px">
                    <img
                      className={cn(index === 0 && 'w-164px h-161px max-xl:w-120px max-xl:h-120px max-lg:w-80px max-lg:h-80px max-md:w-46px max-md:h-45px', index === 1 && 'w-162px h-152px max-xl:w-120px max-xl:h-110px max-lg:w-80px max-lg:h-60px max-md:w-46px max-md:h-43px', index === 2 && 'w-184px h-177px max-xl:w-130px max-xl:h-120px max-lg:w-90px max-lg:h-80px max-md:w-52px max-md:h-49px', index === 3 && 'w-192px h-184px max-xl:w-140px max-xl:h-120px max-lg:w-100px max-lg:h-80px max-md:w-53px max-md:h-51px', 'max-w-auto')}
                      src={item.img}
                    />
                  </div>
                </div>
              ))
            }
          </div>
        </div>

        <ConfigProvider
          theme={{
            // 1. 单独使用暗色算法
            components: {
              Tabs: {

              }
            }

            // 2. 组合使用暗色算法与紧凑算法
            // algorithm: [theme.darkAlgorithm, theme.compactAlgorithm],
          }}
        >
          <Tabs
            className="mt-77px"
            defaultActiveKey="1"
            items={[
              {
                label: 'Tab 1',
                key: '1',
                children: 'Tab 1'
              },
              {
                label: 'Tab 2',
                key: '2',
                children: 'Tab 2'
              },
              {
                label: 'Tab 3',
                key: '3',
                children: 'Tab 3'
              }
            ]}
          />
        </ConfigProvider>
      </div>

      <div className="grid grid-cols-1 mt-8 gap-7 px-8 md:grid-cols-3">
        {
          cards.map((card, i) => (
            <Card
              key={i}
              title={card.title}
              content={card.content}
            >
              <SvgIcon name={card.icon} className="size-5" />
            </Card>
          ))
        }
      </div>

      <div className="mt-32 px-8">
        <div className="text-center text-7.5">{t('home.featured')}</div>

        <Waiting
          for={!propertieLoading}
          className="h-32 fcc"
          iconClass="size-8"
        >
          <div className="grid grid-cols-1 mt-8 gap-7 md:grid-cols-3">
            {
              propertieList && propertieList.map((card) => {
                console.log(card)
                const [picture] = joinImagesPath(card.image_urls)
                return (
                  <FeatureCard
                    key={card.id}
                    picture={picture}
                    title={card.name}
                    location={card.address}
                    price={card.price}
                    house_life={card.house_life}
                    bedrooms={card.bedrooms}
                    className="select-none clickable-99"
                    onClick={() => {
                      navigate({
                        to: '/properties/detail/$id',
                        params: {
                          id: card.id
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

      <div className="mt-32 bg-[#242933] px-8 py-14">
        <div className="text-center text-7.5 font-bold">How It Works</div>

        <div className="grid grid-cols-1 mt-16 gap-8 md:grid-cols-4">
          {
            howItWorks.map((item, index) => (
              <div key={index} className="lt-md:flex lt-md:gap-8 md:text-center">
                <div className="mx-a size-16 fcc shrink-0 rounded-full bg-primary-6 lt-md:mx-0">
                  <SvgIcon name={item.icon} className="size-7" />
                </div>
                <div className="md:mt-4 space-y-2">
                  <div className="text-5">{item.title}</div>
                  <div className="text-3.5">{item.content}</div>
                </div>
              </div>
            ))
          }
        </div>
      </div>

      <div className="mt-32 px-8 py-14">
        <div className="text-center text-7.5 font-medium">{t('home.market.title')}</div>

        <div className="grid grid-cols-1 mt-16 gap-8 md:grid-cols-4">
          <div className="mx-a w-full rounded-xl bg-[#242933] py-6 text-center space-y-4">
            <div className="text-4 text-[#efefef]">{t('home.market.total')}</div>
            <div className="text-7.5 text-[#f9f9f9]">¥4.25B</div>
          </div>

          <div className="mx-a w-full rounded-xl bg-[#242933] py-6 text-center space-y-4">
            <div className="text-4 text-[#efefef]">{t('home.market.investors')}</div>
            <div className="text-7.5 text-[#f9f9f9]">12,450+</div>
          </div>

          <div className="mx-a w-full rounded-xl bg-[#242933] py-6 text-center space-y-4">
            <div className="text-4 text-[#efefef]">{t('home.market.properties')}</div>
            <div className="text-7.5 text-[#f9f9f9]">85</div>
          </div>

          <div className="mx-a w-full rounded-xl bg-[#242933] py-6 text-center space-y-4">
            <div className="text-4 text-[#efefef]">{t('home.market.return')}</div>
            <div className="text-7.5 text-[#f9f9f9]">8.2%</div>
          </div>
        </div>
      </div>

      <div className="mt-32 px-8 text-center space-y-8">
        <div className="text-6 text-[#d2d2d2] md:text-7.5">{t('home.ready.title')}</div>
        <div className="text-4 text-[#d2d2d2] md:text-5">
          {t('home.ready.content')}
        </div>
        <div className="space-x-4 md:space-x-6">
          <button
            className="rounded-md bg-text px-6 py-2 text-background md:px-8 md:py-3"
            onClick={() => {
              navigate({ to: '/investment' })
            }}
          >
            {t('home.ready.button')}
          </button>
          <button
            className="rounded-md bg-background-secondary px-6 py-2 text-text md:px-8 md:py-3"
            onClick={() => {
              navigate({ to: '/about' })
            }}
          >
            {t('home.ready.button2')}
          </button>
        </div>
      </div>
    </div>
  )
}
