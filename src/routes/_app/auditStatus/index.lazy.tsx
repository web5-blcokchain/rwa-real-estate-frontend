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
  const audit_status: number = userData.audit_status
  const items = [
    { title: <div className="max-lg:pb-7">{t('auditStatus.backendAudit')}</div> },
    { title: <div className="max-lg:pb-7">{audit_status === 2 ? t('auditStatus.backendAuditFail') : t('auditStatus.backendAuditPass')}</div> },
    { title: <div className="max-lg:pb-7">{t('auditStatus.walletBindSuccess')}</div> },
    { title: <div className="max-lg:pb-7">{audit_status === 5 ? t('auditStatus.kycAuditFail') : t('auditStatus.kycAuditPass')}</div> }
  ]
  const [wallet, setWallet] = useState<ConnectedWallet | null>(null)
  const [showModal, setShowModal] = useState(false)
  const nowStep = (step: number) => {
    switch (step) {
      case 0:
        return { step: 1, title: 0 }
      case 1:
        return { step: 2, title: 1 }
      case 2:
        return { step: 1, title: 1 }
      case 3:
        return { step: 3, title: 2 }
      case 4:
        return { step: 4, title: 3 }
      case 5:
        return { step: 3, title: 3 }
      default:
        return { step: 0, title: 0 }
    }
  }

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
        {[0, 1, 3, 4].includes(audit_status)
          ? <div className="i-iconoir-pc-check size-24 bg-white"></div>
          : <div className="i-iconoir-pc-warning size-24 bg-white"></div>}
        <div className="text-8 font-bold max-lg:text-4">{items[(nowStep(audit_status).title) === 4 ? 3 : nowStep(audit_status).title].title}</div>
        <div>
          {
            audit_status === 2 && <Button onClick={() => { navigate({ to: '/account/create' }) }} size="large" type="primary">{t('auditStatus.reSubmit')}</Button>
          }
          {
            audit_status === 5 && <Button onClick={() => { setShowModal(true) }} size="large" type="primary">{t('auditStatus.contactAdmin')}</Button>
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
