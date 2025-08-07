import apiClient from './client'

export interface DataListResponse<T> {
  count: number
  list: T[]
  page: number
  pageSize: number
}

export interface AssetsWarningList {
  id: number
  status: number
  rent_due_date: string
  is_over: number
  total_id: number
  user_id: number
  properties_id: number
  number: number
  total_current: string
  price: string
  name: string
  address: string
  image_urls: string
  tx_hash: string
  next_rent_due_date: string
  monthly_rent: string
  contract_address: string
}

/***
 * 获取预警资产列表
 * @param data {page:number,pageSize:number}
 * @returns
 */
export function getWarningList(data: {
  page: number
  pageSize: number
}) {
  return apiClient.post<DataListResponse<AssetsWarningList>>('/api/earlyWarning/warningList', data)
}

export interface WarningRedemption {
  id: number
  properties_id: number
  price: string
  number: number
  create_date: number
  status: number
  type: number
  total_current: string
  received_date: number
  tx_hash: string
  address: string
  name: string
}
/**
 * 获取预警资产赎回列表
 * @param data {page:number,pageSize:number}
 * @returns WarningRedemption
 */
export function getWarningRedemptionList(data: {
  page: number
  pageSize: number
}) {
  return apiClient.post<DataListResponse<WarningRedemption>>('/api/earlyWarning/redemptionList', data)
}

/**
 * 赎回逾期资产
 * @param data
 * @returns
 */
export async function redemptionWarningAssets(data: {
  id: string
  price: string
  tx_hash: string
}) {
  return apiClient.post<any>('/api/earlyWarning/redemption', data)
}

export interface InvestmentDetails {
  total_number: string
  count: number
  monthly_income: number
}
/**
 * 获取逾期汇总记录
 * @returns
 */
export async function getInvestmentDetails() {
  return apiClient.post<InvestmentDetails>('/api/earlyWarning/investmentDetails')
}

export interface RedemptionInfo {
  redemption_current: number
  total_current: number
  price: string
  total_number: string
}
/**
 * 赎回汇总
 * @param id
 * @returns
 */
export async function getRedemptionInfo(id: number) {
  return apiClient.post<RedemptionInfo>('/api/earlyWarning/redemptionDetail', { id })
}
