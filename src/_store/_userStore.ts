import type { userResponse } from '@/api/apiMyInfoApi'
import type { StateCreator } from 'zustand'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface StoreState {
  language: string
  userData: userResponse | object
  assetId: number
  assetObj: object
  setLanguage: (lang: string) => void
  setUserData: (obj: object) => void
  setRegisterData: (obj: object) => void
  setAssetObj: (obj: object) => void
  setAssetId: (id: number) => void
}

const store: StateCreator<StoreState, [], [['zustand/persist', StoreState]]> = persist(
  set => ({
    language: 'en',
    userData: {},
    assetId: 0,
    assetObj: {},
    setLanguage: (language: string) => {
      set({ language })
    },
    setUserData: (obj: object) => {
      set({ userData: obj })
    },
    setAssetId: (id: number) => {
      set({ assetId: id })
    },
    setAssetObj: (obj: object) => {
      set({ assetObj: obj })
    },
    setRegisterData: (obj: object) => {
      // Add logic for setting register data
      set({ userData: obj })
    }
  }),
  { name: 'userInfo' }
)

export const _useStore = create(store)
