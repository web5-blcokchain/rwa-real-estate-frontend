import { Banner } from '@/components/common/banner'

import { createLazyFileRoute } from '@tanstack/react-router'
import { Button } from 'antd'
import { ContactCard } from './-components/contact-card'
import { MemberCard } from './-components/member-card'
import { PartnerCard } from './-components/partner-card'
import { TimelineCard } from './-components/timeline-card'

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

  const timeline = [
    { year: '2020', title: 'Company founded, raised $5M in seed funding' },
    { year: '2021', title: 'Completed first property tokenization project, reached 1,000+ users' },
    { year: '2022', title: 'Obtained FSA license in Japan, expanded to Asian markets' },
    { year: '2023', title: 'AUM exceeded $400M, user base grew to 12,000+' }
  ]

  const partners = [
    new URL('@/assets/images/about-partner-1.png', import.meta.url).href,
    new URL('@/assets/images/about-partner-2.png', import.meta.url).href,
    new URL('@/assets/images/about-partner-3.png', import.meta.url).href,
    new URL('@/assets/images/about-partner-4.png', import.meta.url).href
  ]

  const contacts = [
    {
      icon: 'address',
      title: 'Office Address',
      desc: [
        '1-2-3 Akasaka, Minato-ku',
        'Akasaka Building 15F, Tokyo'
      ]
    },
    {
      icon: 'email',
      title: 'Email',
      desc: [
        'contact@realtoken.com',
        'support@realtoken.com'
      ]
    },
    {
      icon: 'phone',
      title: 'Phone',
      desc: [
        '+81 3-1234-5678',
        'Mon-Fri 9:00-18:00'
      ]
    }
  ]

  return (
    <div className="space-y-8 md:px-8">
      <Banner
        picture={new URL('@/assets/images/about-banner.png', import.meta.url).href}
        title="Redefining the Future of Real Estate Investment"
        subTitle="RealToken is committed to making real estate investment simpler, more transparent, and more inclusive through blockchain technology."
      />

      <div className="grid grid-cols-1 gap-8 px-8 py-12 lg:grid-cols-2 lg:gap-25">
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
        <div className="text-center text-7.5 font-medium">Core Team</div>

        <div
          className="flex flex-col justify-between gap-12 px-8 lg:flex-row md:gap-8"
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

      <div className="py-12 space-y-8">
        <div className="text-center text-7.5 font-medium">Company Timeline</div>

        <div
          className="grid grid-cols-1 gap-8 px-8 lg:grid-cols-2"
        >
          {
            timeline.map(
              card => (
                <TimelineCard key={card.year} {...card} />
              )
            )
          }
        </div>
      </div>

      <div className="py-12 space-y-8">
        <div className="text-center text-7.5 font-medium">Global Partners</div>

        <div className="grid grid-cols-1 gap-8 px-8 lg:grid-cols-4 xs:grid-cols-2">
          {
            partners.map(
              (picture, index) => (
                <PartnerCard key={index} picture={picture} />
              )
            )
          }
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-8 py-12 space-y-8">
        <div className="text-center text-7.5 font-medium">Join Our Team</div>

        <div className="text-center text-5 text-[#b5b5b5]">
          We're looking for passionate talents to join our team and help revolutionize real estate investment together.
        </div>

        <div className="text-center">
          <Button
            type="primary"
            size="large"
            className="text-black!"
          >
            View Open Positions
          </Button>
        </div>
      </div>

      <div className="mx-auto max-w-3xl py-12 space-y-12">
        <div className="text-center text-7.5 font-medium">Contact information</div>

        <div
          className="flex flex-col justify-between gap-12 lg:flex-row md:gap-14"
        >
          {
            contacts.map(
              (contact, index) => (
                <ContactCard key={index} {...contact} />
              )
            )
          }
        </div>
      </div>
    </div>
  )
}
