import type { DetailResponse } from '@/api/basicApi'
import type { InvestmentItem } from '@/types/investment'
import { create } from 'zustand'

interface CommonDataState {
  assets: Map<number, DetailResponse>
  investmentItems: Map<number, InvestmentItem>
}

export const useCommonDataStore = create<CommonDataState>(() => ({
  assets: new Map(),
  investmentItems: new Map()
}))
