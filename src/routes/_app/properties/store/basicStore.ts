import type { StateCreator } from 'zustand'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface StoreState {
  assetId: number
  assetObj: object
  setAssetObj: (obj: object) => void
  setAssetId: (id: number) => void

}

const store: StateCreator<StoreState, [], [['zustand/persist', StoreState]]> = persist(
  set => ({
    assetId: 0,
    assetObj: {},
    setAssetId: (id: number) => {
      set({ assetId: id })
    },
    setAssetObj: (obj: object) => {
      set({ assetObj: obj })
    }
  }),
  { name: 'basket' }
)

export const _useStore = create(store)
