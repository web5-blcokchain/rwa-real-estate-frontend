import { create } from 'zustand'

interface GlobalDialogState {
  message: string | React.ReactNode
  title: string
  visible: boolean
  open: (message: string | React.ReactNode, title?: string) => void
  close: () => void
  className: string
}

export const useMessageDialogStore = create<GlobalDialogState>(set => ({
  message: '',
  title: '',
  visible: false,
  className: '',
  open: (message: string | React.ReactNode, title?: string) => set({ message, title, visible: true }),
  close: () => set({ visible: false })
}))
