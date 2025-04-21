import { ProfileTab } from '@/enums/profile'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface ProfileState {
  selectedTab: ProfileTab
  setSelectedTab: (tab: ProfileTab) => void
}

export const useProfileStore = create<ProfileState>()(
  persist(
    set => ({
      selectedTab: ProfileTab.Overview,
      setSelectedTab: (tab: ProfileTab) => set({ selectedTab: tab })
    }),
    {
      name: 'profile-storage',
      storage: createJSONStorage(() => sessionStorage)
    }
  )
)
