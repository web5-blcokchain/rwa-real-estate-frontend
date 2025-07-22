import type { RegisterParams, UserResponse } from '@/api/apiMyInfoApi'
import type { StateCreator } from 'zustand'
import { UserCode } from '@/enums/user'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface StoreState {
  code: UserCode
  language: string
  userData: UserResponse
  registerData: RegisterParams
  refreshUserInfo: number
  setCode: (code?: UserCode) => void
  setLanguage: (lang: string) => void
  setUserData: (obj: Partial<UserResponse>) => void
  setRegisterData: (obj: Partial<RegisterParams>) => void
  clearRegisterData: () => void
  clearUserData: () => void
  getUserInfo: () => void
}

const store: StateCreator<StoreState, [], [['zustand/persist', Partial<StoreState>]]> = persist(
  set => ({
    code: 401,
    language: 'en',
    userData: {} as UserResponse,
    registerData: {} as RegisterParams,
    refreshUserInfo: 0,
    setCode: (code: UserCode = UserCode.NotExist) => {
      set({ code })
    },
    setLanguage: (language: string) => {
      set({ language })
    },
    setUserData: (obj: Partial<UserResponse>) => {
      set(state => ({ userData: { ...state.userData, ...obj } }))
    },
    clearUserData: () => {
      set({ userData: {} as UserResponse })
    },
    setRegisterData: (obj: Partial<RegisterParams>) => {
      set(state => ({ registerData: { ...state.registerData, ...obj } }))
    },
    clearRegisterData: () => {
      set({ registerData: {} as RegisterParams })
    },
    getUserInfo: () => {
      set(state => ({ refreshUserInfo: state.refreshUserInfo + 1 }))
    }
  }),
  { name: 'userInfo', partialize: (state) => {
    return Object.fromEntries(
      Object.entries(state).filter(([key]) => key !== 'refreshUserInfo')
    )
  } }
)

export const useUserStore = create(store)
