import type { RegisterParams, UserResponse } from '@/api/apiMyInfoApi'
import type { MessageListParams, MessageListResponse } from '@/api/profile'
import type { StateCreator } from 'zustand'
import { TOKEN_LANG_KEY } from '@/constants/user'
import { UserCode } from '@/enums/user'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface TRefreshUserMessageData {
  count: number
  loading: boolean
  params: MessageListParams
}
interface StoreState {
  code: UserCode
  language: string
  userData: UserResponse
  registerData: RegisterParams
  refreshUserInfo: number
  refreshUserMessageData: TRefreshUserMessageData
  userMessage: MessageListResponse
  setCode: (code?: UserCode) => void
  setLanguage: (lang: string) => void
  setUserData: (obj: Partial<UserResponse>) => void
  setRegisterData: (obj: Partial<RegisterParams>) => void
  clearRegisterData: () => void
  clearUserData: () => void
  getUserInfo: () => void
  setUserMessage: (obj: Partial<MessageListResponse>) => void
  clearUserMessage: () => void
  refreshUserMessage: (data?: MessageListParams) => void
  refreshUserMessageSuccess: () => void
}

const store: StateCreator<StoreState, [], [['zustand/persist', Partial<StoreState>]]> = persist(
  set => ({
    code: 401,
    language: 'en',
    userData: {} as UserResponse,
    registerData: {} as RegisterParams,
    refreshUserInfo: 0,
    refreshUserMessageData: {
      count: 0,
      loading: false,
      params: {} as MessageListParams
    },
    userMessage: {} as MessageListResponse,
    setCode: (code: UserCode = UserCode.NotExist) => {
      set({ code })
    },
    setLanguage: (language: string) => {
      localStorage.setItem(TOKEN_LANG_KEY, language)
      set({ language })
    },
    setUserData: (obj: Partial<UserResponse>) => {
      set(state => ({ userData: { ...state.userData, ...obj } }))
    },
    clearUserData: () => {
      set({ userData: {} as UserResponse })
    },
    setRegisterData: (obj: Partial<RegisterParams>) => {
      // debugger
      set(state => ({ registerData: { ...state.registerData, ...obj } }))
    },
    clearRegisterData: () => {
      set({ registerData: {} as RegisterParams })
    },
    getUserInfo: () => {
      set(state => ({ refreshUserInfo: state.refreshUserInfo > 10000 ? 1 : state.refreshUserInfo + 1 }))
    },
    setUserMessage: (obj: Partial<MessageListResponse>) => {
      set(state => ({ userMessage: ({ ...state.userMessage, ...obj }) }))
    },
    clearUserMessage: () => {
      set({ userMessage: {} as MessageListResponse })
    },
    refreshUserMessage(data?: MessageListParams) {
      set(state => ({
        refreshUserMessageData: {
          count: state.refreshUserMessageData.count > 10000 ? 1 : state.refreshUserMessageData.count + 1,
          params: data || ({} as MessageListParams),
          loading: true
        }
      }))
    },
    refreshUserMessageSuccess() {
      set(state => ({
        refreshUserMessageData: {
          ...state.refreshUserMessageData,
          loading: false
        }
      }))
    }
  }),
  {
    name: 'userInfo',
    partialize: (state) => {
      return Object.fromEntries(
        Object.entries(state).filter(([key]) => key !== 'refreshUserInfo')
      )
    }
  }
)

export const useUserStore = create(store)
