import type { ConnectedWallet } from '@privy-io/react-auth'
import { PaymentMethod } from '@/components/common/payment-method'
import { useUserStore } from '@/stores/user'
import { createLazyFileRoute, useNavigate } from '@tanstack/react-router'
import { Button, Modal, Steps } from 'antd'

export const Route = createLazyFileRoute('/_app/auditStatus/')({
  component: RouteComponent
})

function RouteComponent() {
  const { userData, getUserInfo } = useUserStore()
  const navigate = useNavigate()
  const { t } = useTranslation()
  // 0 表示在审核 1的时候表示已审核 2:中心化数据库审核拒绝 3.钱包绑定成功 4.kyc审核通过 5 kyc审核拒绝
  useEffect(() => {
    getUserInfo()
  }, [])
  const audit_status: number = userData.audit_status ?? 0
  const items = [
    { title: <div className="max-lg:pb-7">{t('auditStatus.backendAudit', { status: '' })}</div> },
    { title: <div className="max-lg:pb-7">{t('auditStatus.walletBind', { status: '' })}</div> },
    { title: <div className="max-lg:pb-7">{t('auditStatus.kycAudit', { status: '' })}</div> }
  ]
  const userStatus = [
    'auditStatus.submitUserInfo',
    'auditStatus.submitUserInfoSuccess',
    'auditStatus.walletBind',
    'auditStatus.kycAudit'
  ]
  const [wallet, setWallet] = useState<ConnectedWallet | null>(null)
  const [showModal, setShowModal] = useState(false)
  const nowStep = (step: number) => {
    switch (step) {
      case 0:
        return { step: 0, title: 0 }
      case 1:
        return { step: 1, title: 1 }
      case 2:
        return { step: 1, title: 1 }
      case 3:
        return { step: 2, title: 1 }
      case 4:
        return { step: 4, title: 3 }
      case 5:
        return { step: 3, title: 3 }
      default:
        return { step: 0, title: 0 }
    }
  }

  const userStatusText = useMemo(() => {
    switch (audit_status) {
      case 0:
        return t(userStatus[0])
      case 1:
        return t(userStatus[1], { status: t('auditStatus.success') })
      case 2:
        return t(userStatus[1], { status: t('auditStatus.fail') })
      case 3:
        return t(userStatus[2], { status: t('auditStatus.pass') })
      case 4:
        return t(userStatus[3], { status: t('auditStatus.pass') })
      case 5:
        return t(userStatus[3], { status: t('auditStatus.fail') })
      default:
        return t(userStatus[0])
    }
  }, [userStatus])

  return (
    <div className="fccc p-12 max-lg:p-6">
      <Steps
        current={nowStep(audit_status).step}
        status={[2, 5].includes(audit_status) ? 'error' : 'process'}
        items={items}
      />
      {
        audit_status === 1 && (
          <PaymentMethod
            walletState={[wallet, setWallet]}
            className="mt-10 w-full bg-[#202329] max-lg:mt-50"
          />
        )
      }
      {/* 当前步骤说明 */}
      <div className="mt-20 fccc gap-6 max-lg:mt-10 max-lg:gap-4">
        {[1, 3, 4].includes(audit_status)
          ? <div className="i-iconoir-pc-check size-24 bg-white"></div>
          : <div className="i-iconoir-pc-warning size-24 bg-white"></div>}
        <div className="text-8 font-bold max-lg:text-4">
          {userStatusText}
        </div>
        <div>
          {
            [0, 2, 5].includes(audit_status) && <Button onClick={() => { navigate({ to: '/account/create' }) }} size="large" type="primary">{t('auditStatus.reSubmit')}</Button>
          }
        </div>
      </div>
      <Modal
        title={t('auditStatus.contactAdmin')}
        footer={() => (
          <div className="gap-2">
            <Button onClick={() => { setShowModal(false) }} type="primary">{t('system.confirm')}</Button>
            <Button onClick={() => { setShowModal(false) }} type="dashed" className="ml-2">{t('system.cancel')}</Button>
          </div>
        )}
        open={showModal}
        onCancel={() => { setShowModal(false) }}
      >
        <div>
          <div className="text-6 font-bold max-lg:text-5">
            {t('auditStatus.contactAdminDesc')}
          </div>
        </div>
      </Modal>
    </div>
  )
}
