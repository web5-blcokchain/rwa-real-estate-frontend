import dayjs from 'dayjs'
import '../defaultWarning/info/index.scss'

export function ReviewProgress() {
  const { t } = useTranslation()
  const step = [
    {
      title: 'reviewProgress.step_submit',
      status: dayjs().subtract(7, 'day').format('YYYY-MM-DD')
    },
    {
      title: 'reviewProgress.step_initial_review',
      status: dayjs().subtract(10, 'day').format('YYYY-MM-DD')
    },
    {
      title: 'reviewProgress.step_manual_review',
      status: true ? 'reviewProgress.status.in_progress' : ''
    },
    {
      title: 'reviewProgress.step_token_generation',
      status: true ? 'reviewProgress.status.pending' : ''
    },
    {
      title: 'reviewProgress.step_complete',
      status: true ? 'reviewProgress.status.pending' : ''
    }
  ]
  const nowStep = 3

  return (
    <div className="flex flex-col gap-4 pb-50 text-white">
      <div className="text-whit text-2xl font-bold max-lg:text-xl">{t('reviewProgress.title')}</div>
      <div>
        <div className="text-base">{t('reviewProgress.flow')}</div>
        <div className="warning-step mb-20 mt-30px" style={{ '--step-item-x': '22%', '--step-item-x-plus': '5%' } as any}>
          <div style={{ '--step': nowStep } as any} className="now-step !bg-#242933"></div>
          {
            step.map((item, index) => (
              <div className="step-item" key={item.title + index}>
                <div className={cn('step-item-index p-1 box-content', index < nowStep ? '!bg-#13B981' : '!bg-#D9D9D9 text-black')}>
                  {
                    index < nowStep
                      ? <div className="i-mdi:success size-5 text-white"></div>
                      : <div>{index}</div>
                  }
                </div>
                <div className="step-item-content">
                  <div>{t(item.title)}</div>
                  <div>{[2, 3, 4].includes(index) ? t(item.status) : item.status}</div>
                </div>
              </div>
            ))
          }
        </div>
      </div>
      <div className="fccc gap-2 px-20 text-center text-white max-lg:px-0">
        <div className="i-carbon-warning size-9 bg-white leading-9"></div>
        <div className="text-2xl font-bold max-lg:text-xl">{t('reviewProgress.reviewing')}</div>
        <div className="text-base">{t('reviewProgress.reviewing_desc', { time: dayjs().add(20, 'day').format('YYYY-MM-DD') })}</div>
      </div>
    </div>
  )
}
