import type { AccountType } from '@/enums/create-account'
import apiClient from './client'

interface ResponseData<T> {
  list?: any
  code: number
  msg: string
  data: T
  time: number
}

export interface LoginParams {
  username: string
  password?: string
}

export interface LoginResponse {
  code: number
  data: {
    token: string
    [key: string]: any
  }
  msg?: string
  time: number
}
// 上传文件
export function uploadFile(data: FormData) {
  return apiClient.post<{ file: { url: string } }>('/api/user/upload', data)
}

export interface LoginParams {
  username: string
  password?: string
}

export interface LoginResponse {
  code: number
  data: {
    token: string
    [key: string]: any
  }
  msg?: string
  time: number
}
// 登录接口参数
function logins(data: LoginParams) {
  return apiClient.post<LoginResponse>('/api/user/login', data)
}

export interface RegisterParams {
  mobile?: string
  email?: string
  password?: string
  wallet_address?: string
  type?: AccountType
  id_card_front_url?: string
  id_card_back_url?: string
  address_url?: string
  photo_url?: string
  business_registration_document?: string
  shareholder_structure_url?: string
  legal_representative_documents_url?: string
  financial_documents_url?: string
  token?: string
}
interface RegisterResponse {
  code: number
  data: {
    token: string
    [key: string]: any
  }
}

// 登录接口参数
function register(data: RegisterParams) {
  return apiClient.post<RegisterResponse>('/api/user/register', data)
}

function submitInfo(data: RegisterParams) {
  return apiClient.post<RegisterResponse>('/api/info/submitInfo ', data)
}

export interface AboutMeParams {
  page?: number
  pageSize?: number
  keyword?: string
  status?: number
}

export interface PropertieItem {
  id: number
  user_id: number
  properties_id: number
  purchase_price: number
  current_price: number
  number: number
  name: string
  total_purchase: number
  total_current: number
  create_date: number
  update_date: number
  /** 状态-1锁定中 0 为未领取 1为已领取 2为赎回 3为领取失败 */
  status: number
  address: string
  property_type: string
  bedrooms: number
  expected_annual_return: number
  property_description: string
  location: string
  image_urls: string
  longitude: string | null
  latitude: string | null
  draw_time: string
  drwa_hash: string
  contract_address: string
}
export interface AboutMeResponse {
  list: PropertieItem[]
  count: number
  page: number
  pageSize: number
}
// 获取我的资产列表
function getMeInfo(data: AboutMeParams) {
  return apiClient.post<AboutMeResponse>('/api/assets/myProperties', data)
}

export interface PropertyInvestment {
  id: number // 投资记录 ID
  user_id: number // 用户 ID
  properties_id: number // 关联的房产 ID
  number: number // 购买的份额数
  total_current: string // 当前总价值（字符串表示精度）
  create_date: number // 创建时间戳（秒）
  update_date: number // 更新时间戳（秒）
  current_price: string // 当前单价
  address: string // 地址
  property_type: string // 房产类型（如“独立式住宅”）
  bedrooms: number // 卧室数量
  expected_annual_return: string // 预期年回报率（%）
  property_description: string // 房产描述
  location: string // 位置说明
  image_urls: string // 房产图 URL（如多个建议改为 string[]）
  longitude: string // 经度（如 "1000,2000"，建议规范为 string[] 或两个字段）
  latitude: string | null // 纬度（可能为 null）
  name: string // 房产名称
}

export interface PropertyInvestmentResponse {
  list: PropertyInvestment[]
  count: number
  page: number
  pageSize: number
}
function getMeInfoSummary(data: AboutMeParams) {
  return apiClient.post<PropertyInvestmentResponse>('/api/assets/myPropertiesTotal', data)
}

export interface historyResponse {
  id: number
  income_date: string
  type: number
  properties_id: string
  number: number
  income_amount: string
  total_amount: string
  service_charge: string
  /** 状态 0为未领取 1为已领取 2为领取失败 */
  status: number
  amount: string
  user_address: string
  merkle_proof: string
  tx_hash: string
  remake: string
}
interface EarningsInfoResponse {
  list: historyResponse[]
  count: number
  page: number
  pageSize: number
}

interface HistoryParams {
  page: number
  pageSize: number
  property_type?: number
  /**
   * 状态 0为未发放 1为已发放 2为发放失败 5为发放中
   */
  status?: number
  /**
   * 时间筛选 1: this_month 本月 2: three_months 近三个月 3: six_months 近半年
   */
  timeFilter?: string
}
// 收益记录
function getHistory(params: HistoryParams) {
  return apiClient.post<EarningsInfoResponse>('/api/info/earningsHistory', params)
}

export interface EarningsResponse {
  id: number
  user_id: number
  type: number
  properties_id: number
  income_amount: number
  number: number
  status: number
  income_id: number
  income_date: number
  address: string
}
// 收益记录
function getEarningsHistory(params: { page: number, pageSize: number }) {
  return apiClient.post<ResponseData<EarningsResponse>>('/api/info/earningsHistory', params)
}

export interface UserResponse {
  id: number
  nickname: string
  email: string
  mobile: string
  avatar: string
  gender: number
  address: string
  audit_status: number
  audit_date: number
  type: number
  wallet_address: string
  last_login_time: number
  last_login_ip: number
}
// 用户信息
function getUserInfo() {
  return apiClient.post<UserResponse>('/api/info/userInfo')
}

interface EarningsInfoSummary {
  current_month_income: number
  total_income: number
  avg_month_income: number
}
// 获取收益详情
export async function getEarningsInfo() {
  return apiClient.post<EarningsInfoSummary>('/api/info/getIncomeSummary')
}

// 获取房产类型
interface AssetTypeResponse {
  id: number
  name: string
  code: string
}
export async function getAssetType() {
  return apiClient.post<AssetTypeResponse[]>('/api/assets/pType')
}

// interface EarningsInfoResponse {
//   list: EarningsInfo[]
//   count: number
//   page: number
//   pageSize: number
// }
// // 获取收益列表
// export async function getEarningsList(params: string) {
//   return apiClient.post<EarningsInfoResponse>('/api/info/earningsHistory', {
//     type: params
//   })
// }

const apiMyInfoApi = {
  uploadFile,
  logins,
  register,
  getMeInfo,
  getHistory,
  getEarningsHistory,
  getUserInfo,
  submitInfo,
  getMeInfoSummary
}

export default apiMyInfoApi
