import { Modal } from 'antd'
import './payDialog.scss'

/**
 * 支付弹窗
 * @param param0
 * @returns
 */
export function PayDialog({ onClose, open }: { onClose: () => void, open: boolean }) {
  const { t } = useTranslation()
  return (
    <Modal
      className="max-md:w-80%! [&>div>.ant-modal-content]:!bg-background [&>div>.ant-modal-content]:max-md:backdrop-blur-10px [&>div>.ant-modal-content]:max-md:!bg-#191a1f9c"
      // closeIcon={false}
      centered
      width={460}
      onCancel={onClose}
      open={open}
      footer={null}
    >
      <div className="fccc gap-2 text-center text-base text-white">
        <div className="i-ep-success-filled size-16 bg-#e7bb41"></div>
        <div className="fcc gap-1 text-xl font-bold">
          {t('payment.pay_loading')}
          <div className="pay-loading fyc">
            <div>.</div>
            <div>.</div>
            <div>.</div>
          </div>
        </div>
        <div>{t('payment.pay_loading_desc')}</div>
      </div>
    </Modal>
  )
}
