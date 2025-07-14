import { useMessageDialogStore } from '@/stores/message-dialog'
import { Modal } from 'antd'

function GlobalCommon() {
  const { message, visible, close, title } = useMessageDialogStore()
  return (
    <Modal
      title={title}
      open={visible}
      onCancel={close}
      maskClosable={false}
      className="login-dialog"
      centered
      footer={() => (<div></div>)}
    >
      <div className="p-4">
        {message}
      </div>
    </Modal>
  )
}

export default GlobalCommon
