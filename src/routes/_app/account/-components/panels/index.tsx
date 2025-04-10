import { CreateAccountStep, useSteps } from '../steps-provider'

import CreateAccountPanel from './create-account'
import LoginPrivyPanel from './login-privy'
import VerificationPanel from './verification'

export function AccountPanel() {
  const { currentStep } = useSteps()

  return (
    <>
      { currentStep === CreateAccountStep.LoginPrivy && (<LoginPrivyPanel />) }
      { currentStep === CreateAccountStep.BaseInfo && (<CreateAccountPanel />) }
      { currentStep === CreateAccountStep.Verification && (<VerificationPanel />) }
    </>
  )
}
