import { create } from 'zustand'

interface StoreState {
  assetId: number
  assetObj: object
  setAssetObj: (obj: object) => void
  setAssetId: (id: number) => void

}

const useStore = create<StoreState>((set, _get) => ({
  assetId: 0,
  assetObj: {},
  setAssetId: (id: number) => {
    set({ assetId: id })
  },
  setAssetObj: (obj: object) => {
    set({ assetObj: obj })
  }

}))

export { useStore }
