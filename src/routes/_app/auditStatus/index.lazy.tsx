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
  const items = [
    { title: <div className="max-lg:pb-7">{t('auditStatus.backendAudit')}</div> },
    { title: <div className="max-lg:pb-7">{userData.audit_status === 2 ? t('auditStatus.backendAuditFail') : t('auditStatus.backendAuditPass')}</div> },
    { title: <div className="max-lg:pb-7">{t('auditStatus.walletBindSuccess')}</div> },
    { title: <div className="max-lg:pb-7">{userData.audit_status === 5 ? t('auditStatus.kycAuditFail') : t('auditStatus.kycAuditPass')}</div> }
  ]
  const [wallet, setWallet] = useState<ConnectedWallet | null>(null)
  const [showModal, setShowModal] = useState(false)
  const nowStep = (step: number) => {
    switch (step) {
      case 0:
        return 0
      case 1:
        return 2
      case 2:
        return 1
      case 3:
        return 3
      case 4:
        return 4
      case 5:
        return 3
      default:
        return -1
    }
  }
  return (
    <div className="fccc p-12 max-lg:p-6">
      <Steps
        current={nowStep(userData.audit_status)}
        status={[2, 5].includes(userData.audit_status) ? 'error' : 'process'}
        items={items}
      />
      {
        userData.audit_status === 1 && (
          <PaymentMethod
            walletState={[wallet, setWallet]}
            className="mt-10 w-full bg-[#202329] max-lg:mt-50"
          />
        )
      }
      {/* 当前步骤说明 */}
      <div className="mt-20 fccc gap-6 max-lg:mt-10 max-lg:gap-4">
        {[1, 3, 4].includes(userData.audit_status)
          ? <div className="i-iconoir-pc-check size-24 bg-white"></div>
          : [2, 5].includes(userData.audit_status)
              ? <div className="i-iconoir-pc-warning size-24 bg-white"></div>
              : <div className="i-carbon:close-outline size-24 bg-#ec5b56"></div>}
        <div className="text-8 font-bold max-lg:text-4">{userData.audit_status >= 0 ? items[(nowStep(userData.audit_status)) === 4 ? 3 : nowStep(userData.audit_status)].title : t('header.error.login_required')}</div>
        <div>
          {
            userData.audit_status === 2 && <Button onClick={() => { navigate({ to: '/account/create' }) }} size="large" type="primary">{t('auditStatus.reSubmit')}</Button>
          }
          {
            userData.audit_status === 5 && <Button onClick={() => { setShowModal(true) }} size="large" type="primary">{t('auditStatus.contactAdmin')}</Button>
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
