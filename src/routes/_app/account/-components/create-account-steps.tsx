import { cn } from '@/utils/style'
import { CreateAccountStep, useSteps } from './steps-provider'

export default function CreateAccountSteps() {
  const { t } = useTranslation()
  const { currentStep } = useSteps()

  const steps = [
    {
      step: CreateAccountStep.BaseInfo,
      title: `${t('create.step1')}`
    },
    {
      step: CreateAccountStep.Wallet,
      title: `${t('create.step2')}`
    },
    {
      step: CreateAccountStep.Verification,
      title: `${t('create.step3')}`
    }
  ]

  return (
    <div className="w-full fbc gap-1">
      {
        steps.map((item, i) => (
          <div key={i} className="w-full">
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
  )
}
