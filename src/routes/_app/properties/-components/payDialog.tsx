import { Modal } from 'antd'
import './payDialog.scss'

/**
 * 支付弹窗
 * @param param0
 * @returns
 */
export function PayDialog({ onClose, open }: { onClose: () => void, open: boolean }) {
  return (
    <Modal
      className="[&>div>.ant-modal-content]:!bg-background"
      // closeIcon={false}
      centered
      width={460}
      onCancel={onClose}
      open={open}
      footer={null}
    >
      <div className="fccc gap-2 text-center text-base text-white">
        <div className="i-ep-success-filled size-16 bg-#3b82f7"></div>
        <div className="fcc gap-1 text-xl font-bold">
          支付中请稍后
          <div className="pay-loading fyc">
            <div>.</div>
            <div>.</div>
            <div>.</div>
          </div>
        </div>
        <div>代币支付中，中途不要退出，避免影响和第三方钱包浏览器或者钱包软件通信。支付完成自动跳转～</div>
      </div>
    </Modal>
  )
}
