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
  image_urls: string
}
export interface WarningRedemptionResponse<T> {
  page: number
  pageSize: number
  total: number
  totalPages: number
  list: T[]
}
/**
 * 获取预警资产赎回列表
 * @param data {page:number,pageSize:number}
 * @param data.page 页码
 * @param data.pageSize 每页总量
 * @returns WarningRedemption
 */
export function getWarningRedemptionList(data: {
  page: number
  pageSize: number
}) {
  return apiClient.post<WarningRedemptionResponse<WarningRedemption>>('/api/earlyWarning/redemptionList', data)
}

/**
 * 赎回逾期资产
 * @param data
 * @param data.id
 * @param data.price
 * @param data.tx_hash
 * @returns 成功信息
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
 * @returns InvestmentDetails 逾期汇总记录
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
 * @returns RedemptionInfo 赎回汇总
 */
export async function getRedemptionInfo(id: number) {
  return apiClient.post<RedemptionInfo>('/api/earlyWarning/redemptionDetail', { id })
}

interface StatItem {
  value: string | number // 有的字段是 string (比如 "4250000000.00")，有的字段是 number (比如 12450)
  unit: string
  formatted: string | number // 有的 formatted 是 string，有的直接是 number
}

interface DashboardData {
  total_transaction_volume: StatItem
  active_investors: StatItem
  tokenized_properties: StatItem
  annual_return_rate: StatItem
  update_time: string // "2025-08-23 10:42:09"
  last_updated: string // "数据库更新"
}

/**
 * 获取首页总交易量等数据
 * @returns DashboardData
 */
export async function getHomeStatistics() {
  return apiClient.post<DashboardData>('/api/assets/getStatistics')
}
