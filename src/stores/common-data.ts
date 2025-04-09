import type { DetailResponse } from '@/api/basicApi'
import { create } from 'zustand'

interface CommonDataState {
  assets: Map<number, DetailResponse>
}

export const useCommonDataStore = create<CommonDataState>(() => ({
  assets: new Map()
}))
