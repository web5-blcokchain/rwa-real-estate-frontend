import { useUserStore } from '@/stores/user'

import { getToken } from '@/utils/user'
import { usePrivy } from '@privy-io/react-auth'
import { createLazyFileRoute, useNavigate } from '@tanstack/react-router'
import VerificationPanel from '../-components/panels/verification'

export const Route = createLazyFileRoute('/_app/account/create/')({
  component: RouteComponent
})

function RouteComponent() {
  const { user, ready, authenticated } = usePrivy()
  const { setRegisterData, userData } = useUserStore()
  const navigate = useNavigate()

  const token = getToken()

  useEffect(() => {
    if (
      !ready
      || !authenticated
      || !user?.wallet
      || !token
    ) {
      return
    }

    setRegisterData({
      token: token!,
      email: user.email?.address || user.google?.email
    })
  }, [user?.email?.address, user?.google?.email, token])

  useEffect(() => {
    // 1的时候表示已审核 2:中心化数据库审核拒绝 3.钱包绑定成功 4.kyc审核通过 5 kyc审核拒绝
    if (userData.audit_status && ![2, 5].includes(userData.audit_status)) {
      navigate({
        to: '/home'
      })
    }
  }, [userData])

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
