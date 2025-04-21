import { useGlobalDialogStore } from '@/stores/chat-help-dialog'
import ReactDOM from 'react-dom'

export const ChatButton: FC = () => {
  const { visible, open } = useGlobalDialogStore()

  if (visible) {
    return null
  }

  const button = (
    <div
      className={cn(
        'fixed bottom-4 right-4 fcc p-3 rounded-full',
        'bg-primary-2 z-3000 clickable'
      )}
      onClick={() => open()}
    >
      <div className="i-mingcute-service-fill size-8"></div>
    </div>
  )

  return ReactDOM.createPortal(button, document.body)
}
