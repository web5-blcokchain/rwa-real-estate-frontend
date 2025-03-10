import { createLazyFileRoute } from '@tanstack/react-router'

import { AccountPanel } from '../-components/panels'

export const Route = createLazyFileRoute('/_app/account/create/')({
  component: RouteComponent
})

function RouteComponent() {
  return (
    <div className="h-full fccc gap-12">
      <div className="w-full flex-1">
        <AccountPanel />
      </div>
    </div>
  )
}
