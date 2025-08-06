import { formatNumberNoRound } from '@/utils/number'
import './index.scss'

export default function Info({ secondaryMenuProps }: { secondaryMenuProps: { id: number } }) {
  const { t } = useTranslation('', {
    keyPrefix: 'profile.warning.info'
  })
  const step = [
    {
      title: 'application_submitted',
      status: '2025-07-01'
    },
    {
      title: 'document_review',
      status: '2025-07-01'
    },
    {
      title: 'on_site_inspection',
      status: 'in_progress'
    },
    {
      title: 'final_review',
      status: 'property_freeze_submitted'
    },
    {
      title: 'compensation_payment',
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
          <div className="text-xl max-md:text-base">AT20230815-075</div>
          <div className="text-2xl max-md:text-xl">上海市浦东新区世纪大道100号</div>
        </div>
      </div>
      <div className="pt-5">
        <div className="text-2xl max-md:text-xl">{t('recovery_amount')}</div>
        <div className="grid grid-cols-3 mt-5 gap-2 text-xl max-md:text-base">
          <div>
            <div>{t('rental_income')}</div>
            <div>
              $
              {formatNumberNoRound(24000)}
            </div>
          </div>
          <div>
            <div>{t('insurance_deductible')}</div>
            <div>{t('insurance_deductible_desc', { num: 33.3 })}</div>
          </div>
          <div>
            <div>{t('auction_amount')}</div>
            <div>{t('based_on_actual')}</div>
          </div>
        </div>
      </div>
      <div>
        <div className="pb-6%">
          <div className="text-2xl max-md:text-xl">{t('process_progress')}</div>
          <div className="warning-step mt-30px">
            <div style={{ '--step': 3 } as any} className="now-step"></div>
            {
              step.map((item, index) => (
                <div className="step-item" key={index}>
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
            {t('recovery_process')}
            :
          </div>
          <div className="mt-2 space-y-3">
            {
              process.map((item, index) => {
                return (
                  <div key={index} className="text-xl max-md:text-base">
                    <div>{t(`status.${index + 1}.title`)}</div>
                    <div>
                      {
                        Array.from({ length: item.content }).map((_, contentIndex) => {
                          return <div key={index}>{t(`status.${index + 1}.content-${contentIndex + 1}`)}</div>
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
