import type { CoreTeamResponse } from '@/api/basicApi'
import apiBasic from '@/api/basicApi'

import { Banner } from '@/components/common/banner'
import { useQuery } from '@tanstack/react-query'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Button, Spin } from 'antd'
import { ContactCard } from './-components/contact-card'
import { MemberCard } from './-components/member-card'
import { PartnerCard } from './-components/partner-card'
import { TimelineCard } from './-components/timeline-card'

export const Route = createLazyFileRoute('/_app/about/')({
  component: RouteComponent
})

function RouteComponent() {
  const { t } = useTranslation()
  const { data: listData = [], isLoading } = useQuery<Array<CoreTeamResponse>>({
    queryKey: ['about'],
    queryFn: async () => {
      const res = await apiBasic.getCoreTeam()
      return Array.isArray(res.data) ? res.data : []
    }
  })

  const timeline = [
    { year: '2020', title: `${t('help.title_2020')}` },
    { year: '2021', title: `${t('help.title_2021')}` },
    { year: '2022', title: `${t('help.title_2022')}` },
    { year: '2023', title: `${t('help.title_2023')}` }
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
      title: `${t('help.address')}`,
      desc: [
        '1-2-3 Akasaka, Minato-ku',
        'Akasaka Building 15F, Tokyo'
      ]
    },
    {
      icon: 'email',
      title: `${t('help.email')}`,
      desc: [
        'contact@USDable.com',
        'support@USDable.com'
      ]
    },
    {
      icon: 'phone',
      title: `${t('help.phone')}`,
      desc: [
        '+81 3-1234-5678',
        'Mon-Fri 9:00-18:00'
      ]
    }
  ]

  if (isLoading) {
    return (
      <div className="w-full fcc p-8 h-dvh">
        <Spin />
      </div>
    )
  }

  return (
    <div className="space-y-8 md:px-8">
      <Banner
        picture={new URL('@/assets/images/about-banner.png', import.meta.url).href}
        title={t('help.banner.title')}
        subTitle={t('help.banner.subTitle')}
      />

      <div className="grid grid-cols-1 gap-8 px-8 py-12 lg:grid-cols-2 lg:gap-25">
        <div className="space-y-4">
          <div className="text-5">{t('help.mission_title')}</div>
          <div className="pl-10 space-y-4">
            <div className="text-4">
              {t('help.mission_content')}
            </div>

            <div className="text-4 text-[#b5b5b5]">
              {t('help.platform_title')}
            </div>

            <ul className="list-disc pl-10 text-4 text-[#b5b5b5] space-y-2">
              <li>{t('help.list_li1')}</li>
              <li>{t('help.list_li2')}</li>
              <li>{t('help.list_li3')}</li>
              <li>{t('help.list_li4')}</li>
            </ul>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <img src={new URL('@/assets/images/about-our-mission.png', import.meta.url).href} />
        </div>
      </div>

      <div className="bg-[#111827] py-12 space-y-8">
        <div className="text-center text-7.5 font-medium">{t('help.core_team')}</div>

        <div
          className="flex flex-col justify-between gap-12 px-8 lg:flex-row md:gap-8"
        >
          {
            listData.map(member => (
              <MemberCard key={member.id} {...member} />
            ))
          }
        </div>
      </div>

      <div className="py-12 space-y-8">
        <div className="text-center text-7.5 font-medium">{t('help.timeline')}</div>

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
        <div className="text-center text-7.5 font-medium">
          {t('help.global_partners')}
          {' '}
        </div>

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
        <div className="text-center text-7.5 font-medium">{t('help.join_team')}</div>

        <div className="text-center text-5 text-[#b5b5b5]">
          {t('help.join_team_subTitle')}
        </div>

        <div className="text-center">
          <Button
            type="primary"
            size="large"
            className="text-black!"
          >
            {t('help.positions')}
          </Button>
        </div>
      </div>

      <div className="mx-auto max-w-3xl py-12 space-y-12">
        <div className="text-center text-7.5 font-medium">
          {' '}
          {t('help.contact')}
        </div>

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
