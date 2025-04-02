import { cn } from '@/utils/style'
import { CreateAccountStep, useSteps } from './steps-provider'

export default function CreateAccountSteps() {
  const { currentStep, prev } = useSteps()

  const steps = [
    {
      step: CreateAccountStep.BaseInfo,
      title: 'Create Your Account'
    },
    {
      step: CreateAccountStep.Wallet,
      title: 'Connect Wallet'
    },
    {
      step: CreateAccountStep.Verification,
      title: 'Identity Verification'
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
      </div>
    </div>
  )
}
