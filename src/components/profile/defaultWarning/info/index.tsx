import { useCommonDataStore } from '@/stores/common-data'
import { formatNumberNoRound } from '@/utils/number'
import dayjs from 'dayjs'
import './index.scss'

export default function Info({ secondaryMenuProps }:
{ secondaryMenuProps: { id: number, status: number, name: string, address: string, monthly_rent: string, rent_due_date: string } }) {
  const { t } = useTranslation()
  const commonData = useCommonDataStore()
  const step = [
    {
      title: 'profile.warning.info.application_submitted',
      status: '' // TODO: 获取状态
    },
    {
      title: 'profile.warning.info.document_review',
      status: '' // TODO: 获取状态
    },
    {
      title: 'profile.warning.info.on_site_inspection',
      status: secondaryMenuProps.status === 3 ? 'profile.warning.info.in_progress' : ''
    },
    {
      title: 'profile.warning.info.final_review',
      status: secondaryMenuProps.status > 6 ? 'profile.warning.info.property_freeze_submitted' : ''
    },
    {
      title: 'profile.warning.info.compensation_payment',
      status: ''
    }
  ]

  const process = [
    { content: 3 },
    { content: 2 },
    { content: 2 },
    { content: 2 },
    { content: 2 }
  ]

  // const secondaryStatus = useMemo(() => {
  //   const status = secondaryMenuProps.status

  //   return secondaryMenuProps.status
  // }, [secondaryMenuProps.status])

  useEffect(() => {
    console.log(secondaryMenuProps)
  })
  return (
    <div className="text-white [&>div:last-child]:b-0 [&>div]:b-b-1 [&>div]:b-b-[#202329] [&>div]:pb-30px">
      <div className="fyc gap-5">
        <div className="relative size-100px overflow-hidden rounded-md">
          <img className="absolute inset-0 left-1/2 top-1/2 h-full !max-w-max -translate-x-1/2 -translate-y-1/2" src="https://dev1.usdable.com/storage/default/20250725/3040-1fd5d90f3b9336d3f22f69ca4b56f1a44df56a31e.jpg" alt="" />
        </div>
        <div className="flex-1">
          <div className="text-xl max-md:text-base">{secondaryMenuProps.name}</div>
          <div className="text-2xl max-md:text-xl">{secondaryMenuProps.address}</div>
        </div>
      </div>
      <div className="pt-5">
        <div className="text-2xl max-md:text-xl">{t('profile.warning.info.recovery_amount')}</div>
        <div className="grid grid-cols-3 mt-5 gap-2 text-xl max-md:text-base">
          <div>
            <div>{t('profile.warning.info.rental_income')}</div>
            <div>
              {formatNumberNoRound(Math.max(dayjs(secondaryMenuProps.rent_due_date).diff(dayjs(), 'month'), 1) * Number(secondaryMenuProps.monthly_rent))}
              {' '}
              {commonData.payTokenName}
            </div>
          </div>
          <div>
            <div>{t('profile.warning.info.insurance_deductible')}</div>
            <div>{t('profile.warning.info.insurance_deductible_desc', { num: 33.3 })}</div>
          </div>
          <div>
            <div>{t('profile.warning.info.auction_amount')}</div>
            <div>{t('profile.warning.info.based_on_actual')}</div>
          </div>
        </div>
      </div>
      <div>
        <div className="pb-6%">
          <div className="text-2xl max-md:text-xl">{t('profile.warning.info.process_progress')}</div>
          <div className="warning-step mt-30px">
            <div style={{ '--step': 5 } as any} className="now-step"></div>
            {
              step.map((item, index) => (
                <div className="step-item" key={item.title + index}>
                  <div className="step-item-index">{index + 1}</div>
                  <div className="step-item-content">
                    <div>{t(item.title)}</div>
                    <div>{[2, 3].includes(index) ? t(item.status) : item.status}</div>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
        <div className="mt-20">
          <div className="text-2xl max-md:text-xl">
            {t('profile.warning.info.recovery_process')}
            :
          </div>
          <div className="mt-2 space-y-3">
            {
              process.map((item, index) => {
                return (
                  <div key={index} className="text-xl max-md:text-base">
                    <div>{t(`profile.warning.info.status.${index + 1}.title`)}</div>
                    <div>
                      {
                        Array.from({ length: item.content }).map((_, contentIndex) => {
                          return <div key={`${item.content}-${index}-${contentIndex}`}>{t(`profile.warning.info.status.${index + 1}.content-${contentIndex + 1}`)}</div>
                        })
                      }
                    </div>

                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
    </div>
  )
}
