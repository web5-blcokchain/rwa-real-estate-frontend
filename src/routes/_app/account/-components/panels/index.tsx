import { CreateAccountStep, useSteps } from '../steps-provider'

import CreateAccountPanel from './create-account'
import VerificationPanel from './verification'

export function AccountPanel() {
  const { currentStep } = useSteps()

  return (
    <>
      { currentStep === CreateAccountStep.BaseInfo && (<CreateAccountPanel />) }
      { currentStep === CreateAccountStep.Verification && (<VerificationPanel />) }
    </>
  )
}
