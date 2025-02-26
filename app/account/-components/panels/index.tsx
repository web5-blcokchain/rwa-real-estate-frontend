import { CreateAccountStep, useSteps } from "../steps-provider"

import CreateAccountPanel from "./create-account"
import ConnectWalletPanel from "./connect-wallet"
import VerificationPanel from "./verification"

export function AccountPanel() {
  const { currentStep } = useSteps()

  return (
    <>
      { currentStep === CreateAccountStep.BaseInfo && (<CreateAccountPanel />) }
      { currentStep === CreateAccountStep.Wallet && (<ConnectWalletPanel />) }
      { currentStep === CreateAccountStep.Verification && (<VerificationPanel />) }
    </>
  )
}
