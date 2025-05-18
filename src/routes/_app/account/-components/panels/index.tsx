import { CreateAccountStep, useSteps } from '../steps-provider'
import BindWalletPanel from './bind-wallet'

import LoginPrivyPanel from './login-privy'
import VerificationPanel from './verification'

export function AccountPanel() {
  const { currentStep } = useSteps()

  switch (currentStep) {
    case CreateAccountStep.LoginPrivy:
      return <LoginPrivyPanel />
    case CreateAccountStep.BindWallet:
      return <BindWalletPanel />
    case CreateAccountStep.Verification:
      return <VerificationPanel />
  }

  return null
}
