import { create } from 'zustand'

interface GlobalDialogState {
  message: string | React.ReactNode
  title: string
  visible: boolean
  open: (message: string | React.ReactNode, title?: string) => void
  close: () => void
}

export const useMessageDialogStore = create<GlobalDialogState>(set => ({
  message: '',
  title: '',
  visible: false,
  open: (message: string | React.ReactNode, title?: string) => set({ message, title, visible: true }),
  close: () => set({ visible: false })
}))
