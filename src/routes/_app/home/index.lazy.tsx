import { Banner } from '@/components/common/banner'
import Card from '@/components/home/card'

import FeatureCard from '@/components/home/feature-card'
import { createLazyFileRoute, useNavigate } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_app/home/')({
  component: RouteComponent
})

function RouteComponent() {
  const { t } = useTranslation()
  const navigate = useNavigate()

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

  const featureCards = [
    {
      picture: new URL('@/assets/images/feature-card.png', import.meta.url).href,
      title: 'Tokyo Luxury Apartment',
      location: 'Minato-ku, Tokyo',
      price: 80,
      tokenPrice: 1000,
      apy: 8.5
    },
    {
      picture: new URL('@/assets/images/feature-card.png', import.meta.url).href,
      title: 'Osaka Office Complex',
      location: 'Chuo-ku, Osaka',
      price: 120,
      tokenPrice: 2000,
      apy: 7.2
    },
    {
      picture: new URL('@/assets/images/feature-card.png', import.meta.url).href,
      title: 'Ginza Commercial Center',
      location: 'Ginza, Tokyo',
      price: 200,
      tokenPrice: 5000,
      apy: 9.1
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

  return (
    <div className="md:px-8">
      <Banner
        picture={new URL('@/assets/images/home-banner.png', import.meta.url).href}
        title={t('home.banner.title')}
        subTitle={t('home.banner.subTitle')}
      />

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

        <div className="grid grid-cols-1 mt-8 gap-7 md:grid-cols-3">
          {
            featureCards.map((card, i) => (
              <FeatureCard
                key={i}
                {...card}
              />
            ))
          }
        </div>
      </div>

      <div className="mt-32 bg-[#242933] px-8 py-14">
        <div className="text-center text-7.5 font-bold">How It Works</div>

        <div className="grid grid-cols-1 mt-16 gap-8 md:grid-cols-4">
          {
            howItWorks.map((item, index) => (
              <div key={index} className="lt-md:flex lt-md:gap-4 md:text-center">
                <div className="mx-a size-16 fcc rounded-full bg-primary-6">
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
          >
            {t('home.ready.button2')}
          </button>
        </div>
      </div>
    </div>
  )
}
