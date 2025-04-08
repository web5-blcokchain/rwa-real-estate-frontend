import type { TabsProps } from 'antd'
import { useGlobalDialogStore } from '@/stores/global-dialog'
import { Tabs } from 'antd'
import ReactDOM from 'react-dom'
import { Chat } from './chat'
import { Help } from './help'

import './styles.scss'

export const GlobalDialog: FC = () => {
  const { visible, key, setKey } = useGlobalDialogStore()

  if (!visible)
    return null

  const items: TabsProps['items'] = [
    {
      key: 'chat',
      label: 'Chat',
      children: <Chat />
    },
    {
      key: 'help',
      label: 'Help',
      children: <Help />
    }
  ]

  const dialogContent = (
    <div className={cn(
      'fixed bottom-0 right-0 m-4 flex flex-col gap-2',
      'h-128 w-80 rounded-xl bg-[#65686B] z-3000'
    )}
    >
      <Tabs
        activeKey={key}
        items={items}
        className="w-full"
        onChange={key => setKey(key as 'chat' | 'help')}
      />
    </div>
  )

  return ReactDOM.createPortal(dialogContent, document.body)
}
