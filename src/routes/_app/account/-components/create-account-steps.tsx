import { cn } from '@/utils/style'
import { CreateAccountStep, useSteps } from './steps-provider'

export default function CreateAccountSteps() {
  const { t } = useTranslation()
  const { currentStep, prev } = useSteps()

  const steps = [
    {
      step: CreateAccountStep.LoginPrivy,
      title: `${t('create.step1')}`
    },
    // {
    //   step: CreateAccountStep.BindWallet,
    //   title: `${t('create.step2')}`
    // },
    {
      step: CreateAccountStep.Verification,
      title: `${t('create.step3')}`
    }
  ]

  return (
    <div className="w-full">
      <div className="w-full flex items-start gap-8">
        <div className="fcc">
          <div className="i-tabler-arrow-left size-8 bg-gray clickable" onClick={prev}></div>
        </div>
        <div className="fbc flex-1 gap-1">
          {
            steps.map(item => (
              <div key={item.step} className="w-full">
                <div className={cn(
                  'b b-text-secondary b-solid h-2',
                  currentStep === item.step ? 'bg-primary' : ''
                )}
                >
                </div>
                <div className="mt-4 text-center text-4">
                  {item.title}
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}
