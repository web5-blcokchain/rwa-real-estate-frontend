import Card from '@/components/home/card'
import { cn } from '@/utils/style'
import Image from 'next/image'
import styles from './page.module.scss'

export default function Home() {
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

  return (
    <div className="size-full">
      <header className="h-32 fbc px-8 text-text">
        <div className="fyc gap-8">
          <div className="text-5 text-primary">Real Estate RWA</div>

          <nav className="fyc gap-8 text-4 font-extralight">
            <div>Home</div>
            <div>Properties</div>
            <div>Investment</div>
            <div>About</div>
          </nav>
        </div>

        <div className="fyc gap-4">
          <div className="fyc gap-1">
            <div className="i-majesticons-globe-line size-5 bg-white"></div>
            <div className="text-4">English</div>
            <div className="i-ic-round-keyboard-arrow-down size-5 bg-white"></div>
          </div>

          <div className="i-material-symbols-help-outline size-5 bg-white"></div>
          <div className="i-material-symbols-notifications-outline size-5 bg-white"></div>
          <div className="i-material-symbols-favorite-outline-rounded size-5 bg-white"></div>

          <div className="fyc gap-1">
            <div className="i-material-symbols-account-circle-outline size-5 bg-white"></div>
            <div className="text-4">chloe</div>
            <div className="i-ic-round-keyboard-arrow-down size-5 bg-white"></div>
          </div>
        </div>
      </header>

      <div>
        <div className={cn(
          styles.homeBanner,
          'h-100 flex flex-col justify-center gap-6 px-10'
        )}
        >
          <div className="text-11 text-white">Tokenize Real Estate Investment</div>
          <div className="max-w-2xl text-5 text-white">
            Global property investment made accessible through blockchain technology. Start investing in premium real estate with minimal capital.
          </div>
          <div className="space-x-6">
            <button className="rounded-md bg-background px-8 py-3 text-text">Start Investing</button>
            <button className="rounded-md bg-text px-8 py-3 text-background">Learn More</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 mt-8 gap-7">
        {
          cards.map((card, i) => (
            <Card
              key={i}
              title={card.title}
              content={card.content}
            >
              <Image src={`/assets/icons/${card.icon}.svg`} width={20} height={20} alt="icon" />
            </Card>
          ))
        }
      </div>
    </div>
  )
}
