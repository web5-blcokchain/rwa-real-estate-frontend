import { create } from 'zustand'

interface GlobalDialogState {
  visible: boolean
  key: 'chat' | 'help'
  open: (key?: 'chat' | 'help') => void
  close: () => void
  setKey: (key: 'chat' | 'help') => void
  setVisible: (visible: boolean) => void
}

export const useGlobalDialogStore = create<GlobalDialogState>(set => ({
  visible: false,
  key: 'chat',
  open: key => set({ visible: true, key: key || 'chat' }),
  close: () => set({ visible: false }),
  setKey: key => set({ key }),
  setVisible: visible => set({ visible })
}))
