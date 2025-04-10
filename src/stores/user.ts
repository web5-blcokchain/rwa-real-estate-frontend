import type { RegisterParams, UserResponse } from '@/api/apiMyInfoApi'
import type { StateCreator } from 'zustand'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface StoreState {
  isExist: boolean
  language: string
  userData: UserResponse
  registerData: RegisterParams
  setExist: (isExist: boolean) => void
  setLanguage: (lang: string) => void
  setUserData: (obj: Partial<UserResponse>) => void
  setRegisterData: (obj: Partial<RegisterParams>) => void
}

const store: StateCreator<StoreState, [], [['zustand/persist', StoreState]]> = persist(
  set => ({
    isExist: true,
    language: 'en',
    userData: {} as UserResponse,
    registerData: {} as RegisterParams,
    setExist: (isExist: boolean) => {
      set({ isExist })
    },
    setLanguage: (language: string) => {
      set({ language })
    },
    setUserData: (obj: Partial<UserResponse>) => {
      set(state => ({ userData: { ...state.userData, ...obj } }))
    },
    setRegisterData: (obj: Partial<RegisterParams>) => {
      set(state => ({ registerData: { ...state.registerData, ...obj } }))
    }
  }),
  { name: 'userInfo' }
)

export const useUserStore = create(store)
