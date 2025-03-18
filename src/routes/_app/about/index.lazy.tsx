import { Banner } from '@/components/common/banner'

import { createLazyFileRoute } from '@tanstack/react-router'
import { MemberCard } from './-components/member-card'

export const Route = createLazyFileRoute('/_app/about/')({
  component: RouteComponent
})

function RouteComponent() {
  const coreTeam = [
    {
      picture: new URL('@/assets/images/about-core-team-1.png', import.meta.url).href,
      name: 'Kenichi Yamada',
      title: 'Chief Executive Officer',
      desc: 'Former Head of Real Estate Investment at Mizuho Bank, with 20 years of fintech experience'
    },
    {
      picture: new URL('@/assets/images/about-core-team-2.png', import.meta.url).href,
      name: 'Sarah Chen',
      title: 'Chief Technology Officer',
      desc: 'Blockchain expert, led multiple major fintech project developments'
    },
    {
      picture: new URL('@/assets/images/about-core-team-3.png', import.meta.url).href,
      name: 'Michael Thompson',
      title: 'Chief Operating Officer',
      desc: 'Real estate investment expert with 15 years of international market experience'
    }
  ]

  return (
    <div className="space-y-8 md:px-8">
      <Banner
        picture={new URL('@/assets/images/about-banner.png', import.meta.url).href}
        title="Redefining the Future of Real Estate Investment"
        subTitle="RealToken is committed to making real estate investment simpler, more transparent, and more inclusive through blockchain technology."
      />

      <div className="grid grid-cols-1 gap-8 px-8 lg:grid-cols-2 lg:gap-25">
        <div className="space-y-4">
          <div className="text-5">Our Mission</div>
          <div className="pl-10 space-y-4">
            <div className="text-4">
              Founded in 2020, RealToken aims to revolutionize traditional real estate investment through blockchain technology.
              We believe everyone should have the opportunity to participate in quality real estate investment, regardless of their budget.
            </div>

            <div className="text-4 text-[#b5b5b5]">
              Through our platform, investors can:
            </div>

            <ul className="list-disc pl-10 text-4 text-[#b5b5b5] space-y-2">
              <li>Participate in global premium real estate investment with low barriers</li>
              <li>Enjoy fully transparent property management and profit distribution</li>
              <li>Tede asscts feabhy at any timc</li>
              <li>Receive professional investment advice and support</li>
            </ul>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <img src={new URL('@/assets/images/about-our-mission.png', import.meta.url).href} />
        </div>
      </div>

      <div className="bg-[#111827] py-12 space-y-8">
        <div className="text-center text-7.5">Core Team</div>

        <div
          className="flex flex-col justify-between gap-12 lg:flex-row md:gap-8"
        >
          {
            coreTeam.map(
              (member, index) => (
                <MemberCard key={index} {...member} />
              )
            )
          }
        </div>
      </div>
    </div>
  )
}
