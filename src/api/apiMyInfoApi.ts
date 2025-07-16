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
  /** 状态0 为未领取 1为已领取 2为赎回 3为领取失败 */
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

export interface historyResponse {
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
function getHistory() {
  return apiClient.post<ResponseData<historyResponse>>('/api/info/earningsHistory')
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
function getEarningsHistory() {
  return apiClient.post<ResponseData<EarningsResponse>>('/api/info/earningsHistory')
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

const apiMyInfoApi = {
  uploadFile,
  logins,
  register,
  getMeInfo,
  getHistory,
  getEarningsHistory,
  getUserInfo,
  submitInfo
}

export default apiMyInfoApi
