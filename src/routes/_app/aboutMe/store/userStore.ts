import type { userResponse } from '@/api/apiMyInfoApi'
import type { StateCreator } from 'zustand'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface StoreState {
  userData: userResponse | object
  setUserData: (obj: object) => void
}

const store: StateCreator<StoreState, [], [['zustand/persist', StoreState]]> = persist(
  set => ({
    userData: {},
    setUserData: (obj: object) => {
      set({ userData: obj })
    }
  }),
  { name: 'userInfo' }
)

export const _useStore = create(store)
