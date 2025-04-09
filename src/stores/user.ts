import type { RegisterParams, UserResponse } from '@/api/apiMyInfoApi'
import type { StateCreator } from 'zustand'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface StoreState {
  language: string
  userData: UserResponse
  registerData: RegisterParams
  setLanguage: (lang: string) => void
  setUserData: (obj: Partial<UserResponse>) => void
  setRegisterData: (obj: Partial<RegisterParams>) => void
}

const store: StateCreator<StoreState, [], [['zustand/persist', StoreState]]> = persist(
  set => ({
    language: 'en',
    userData: {} as UserResponse,
    registerData: {} as RegisterParams,
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
