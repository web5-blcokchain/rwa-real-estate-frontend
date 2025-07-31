import { createLazyFileRoute } from '@tanstack/react-router'

import VerificationPanel from '../-components/panels/verification'

export const Route = createLazyFileRoute('/_app/account/create/')({
  component: RouteComponent
})

function RouteComponent() {
  return (
    // <StepsProvider>
    //   <div className="fccc gap-12">
    //     <CreateAccountSteps />
    //     <div className="w-full flex-1 py-12 max-lg:px-16px">
    //       <AccountPanel />
    //     </div>
    //   </div>
    // </StepsProvider>
    <div className="px-4">
      <VerificationPanel />
    </div>
  )
}
