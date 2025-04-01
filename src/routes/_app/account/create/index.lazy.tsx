import { createLazyFileRoute } from '@tanstack/react-router'

import CreateAccountSteps from '../-components/create-account-steps'
import { AccountPanel } from '../-components/panels'
import { StepsProvider } from '../-components/steps-provider'

export const Route = createLazyFileRoute('/_app/account/create/')({
  component: RouteComponent
})

function RouteComponent() {
  return (
    <StepsProvider>
      <div className="fccc gap-12">
        <CreateAccountSteps />
        <div className="w-full flex-1 py-12">
          <AccountPanel />
        </div>
      </div>
    </StepsProvider>
  )
}
