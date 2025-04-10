import { CreateAccountStep, useSteps } from '../steps-provider'

import CreateAccountPanel from './complete-account'
import LoginPrivyPanel from './login-privy'
import VerificationPanel from './verification'

export function AccountPanel() {
  const { currentStep } = useSteps()

  switch (currentStep) {
    case CreateAccountStep.LoginPrivy:
      return <LoginPrivyPanel />
    case CreateAccountStep.CompleteAccount:
      return <CreateAccountPanel />
    case CreateAccountStep.Verification:
      return <VerificationPanel />
  }

  return null
}
