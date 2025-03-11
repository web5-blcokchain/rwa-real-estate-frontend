import Card from '@/components/home/card'

import FeatureCard from '@/components/home/feature-card'
import { createLazyFileRoute } from '@tanstack/react-router'
import styles from './style.module.scss'

export const Route = createLazyFileRoute('/_app/home/')({
  component: RouteComponent
})

function RouteComponent() {
  const cards = [
    {
      icon: 'pie-chart',
      title: 'Fractional Ownership',
      content: 'Invest in premium real estate with as little as $100. Own a piece of high-value properties worldwide.'
    },
    {
      icon: 'security',
      title: 'Regulatory Compliance',
      content: 'Fully regulated platform with robust KYC/AML procedures. Your investments are secure and compliant.'
    },
    {
      icon: 'double-arrow',
      title: 'Liquid Investment',
      content: 'Trade your property tokens 24/7 on our secondary market. Unprecedented liquidity for real estate.'
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
      title: '1. Create Account',
      content: 'Sign up and complete KYC verification to start investing'
    },
    {
      icon: 'building',
      title: '2. Choose Property',
      content: 'Browse and select from our curated property offerings'
    },
    {
      icon: 'currency',
      title: '3. Purchase Tokens',
      content: 'Buy property tokens with your preferred payment method'
    },
    {
      icon: 'create-account',
      title: '4. Earn Returns',
      content: 'Receive regular rental income and capital appreciation'
    }
  ]

  return (
    <div className="md:px-8">
      <div>
        <div className={cn(
          styles.homeBanner,
          'h-100 flex flex-col justify-center gap-6 px-10'
        )}
        >
          <div className="text-white lt-md:text-8 md:text-11">Tokenize Real Estate Investment</div>
          <div className="max-w-2xl text-white lt-md:text-4 md:text-5">
            Global property investment made accessible through blockchain technology. Start investing in premium real estate with minimal capital.
          </div>
          <div className="space-x-3 md:space-x-6">
            <button className="rounded-md bg-background px-4 py-2 text-text md:px-8 md:py-3">Start Investing</button>
            <button className="rounded-md bg-text px-4 py-2 text-background md:px-8 md:py-3">Learn More</button>
          </div>
        </div>
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
        <div className="text-center text-7.5">Featured Properties</div>

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

        <div className="mt-16 flex items-start gap-12 lt-md:flex-col md:gap-8">
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
        <div className="text-center text-7.5 font-medium">Market Statistics</div>

        <div className="grid grid-cols-1 mt-16 gap-8 md:grid-cols-4">
          <div className="mx-a w-full rounded-xl bg-[#242933] py-6 text-center space-y-4">
            <div className="text-4 text-[#efefef]">Total Property Value</div>
            <div className="text-7.5 text-[#f9f9f9]">¥4.25B</div>
          </div>

          <div className="mx-a w-full rounded-xl bg-[#242933] py-6 text-center space-y-4">
            <div className="text-4 text-[#efefef]">Active Investors</div>
            <div className="text-7.5 text-[#f9f9f9]">12,450+</div>
          </div>

          <div className="mx-a w-full rounded-xl bg-[#242933] py-6 text-center space-y-4">
            <div className="text-4 text-[#efefef]">Tokenized Properties</div>
            <div className="text-7.5 text-[#f9f9f9]">85</div>
          </div>

          <div className="mx-a w-full rounded-xl bg-[#242933] py-6 text-center space-y-4">
            <div className="text-4 text-[#efefef]">Average Annual Return</div>
            <div className="text-7.5 text-[#f9f9f9]">8.2%</div>
          </div>
        </div>
      </div>

      <div className="mt-32 px-8 text-center space-y-8">
        <div className="text-6 text-[#d2d2d2] md:text-7.5">Ready to Start Investing?</div>
        <div className="text-4 text-[#d2d2d2] md:text-5">
          Join thousands of investors already earning passive income through tokenized real estate.
        </div>
        <div className="space-x-4 md:space-x-6">
          <button className="rounded-md bg-text px-6 py-2 text-background md:px-8 md:py-3">Start Investing</button>
          <button className="rounded-md bg-background-secondary px-6 py-2 text-text md:px-8 md:py-3">Learn More</button>
        </div>
      </div>
    </div>
  )
}
