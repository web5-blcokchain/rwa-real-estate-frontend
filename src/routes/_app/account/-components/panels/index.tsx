import { CreateAccountStep, useSteps } from '../steps-provider'

import CreateAccountPanel from './improve-account'
import LoginPrivyPanel from './login-privy'
import VerificationPanel from './verification'

export function AccountPanel() {
  const { currentStep } = useSteps()

  switch (currentStep) {
    case CreateAccountStep.LoginPrivy:
      return <LoginPrivyPanel />
    case CreateAccountStep.ImproveAccount:
      return <CreateAccountPanel />
    case CreateAccountStep.Verification:
      return <VerificationPanel />
  }

  return null
}
