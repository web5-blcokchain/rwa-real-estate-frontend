'use client'

import CreateAccountSteps from '../-components/create-account-steps'
import { AccountPanel } from '../-components/panels'

export default function AccountCreate() {
  return (
    <div className="h-full fccc gap-12">
      <CreateAccountSteps />
      <div className="w-full flex-1">
        <AccountPanel />
      </div>
    </div>
  )
}
