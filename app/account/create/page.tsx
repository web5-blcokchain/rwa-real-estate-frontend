'use client'

import CreateAccountSteps from '../-components/create-account-steps'
import { AccountPanel } from '../-components/panels'
import { StepsProvider } from '../-components/steps-provider'

export default function AccountCreate() {
  return (
    <StepsProvider>
      <div className="h-full fccc gap-12">
        <CreateAccountSteps />
        <div className="w-full flex-1">
          <AccountPanel />
        </div>
      </div>
    </StepsProvider>
  )
}
