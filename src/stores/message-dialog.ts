import { create } from 'zustand'

interface GlobalDialogState {
  message: string | React.ReactNode
  visible: boolean
  open: (message: string | React.ReactNode) => void
  close: () => void
}

export const useGlobalDialogStore = create<GlobalDialogState>(set => ({
  message: '',
  visible: false,
  open: (message: string | React.ReactNode) => set({ message, visible: true }),
  close: () => set({ visible: false })
}))
