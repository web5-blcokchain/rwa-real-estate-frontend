import apiClient from './client'

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
function logins(data: LoginParams, type: number) {
  return apiClient.post<LoginResponse>('/api/user/login', data, {
    headers: {
      'Content-Type': 'application/json',
      'server': true,
      type
    }
  })
}

export interface DataListParams {
  page?: number
  pageSize?: number
  keyword?: string
}

export interface DataListResponse {
  count: number
  list: any[]
  page: number
  pageSize: number
}
// 列表接口参数
function getDataList(data: DataListParams) {
  return apiClient.post<DataListResponse>('/api/assets/index', data)
}

interface DataListDetailParams {
  id: number
}

export interface DetailResponse {
  Inception_number: number
  address: string
  area: string
  bedrooms: number
  capital_appreciation: string
  create_user: string
  created_date: string
  district: string
  equity: string
  expected_annual_return: string
  house_life: string
  id: number
  image_urls: string
  latitude: string
  location: string
  longitude: string
  monthly_rent: string
  name: string
  number: string
  postcode: string
  price: string
  property_description: string
  property_type: string
  rental_yield: string
  status: string
  updated_date: string
  valuation_report: string
}
// 详情接口参数
function getDataListDetail(data: DataListDetailParams) {
  return apiClient.post<DetailResponse>('/api/assets/details', data)
}
export interface PriceTrendResponse {
  id: number
  date: string
  price: string
}
// 价格趋势图
function getPriceTrend() {
  return apiClient.post<PriceTrendResponse>('/api/chart/price_trend')
}

interface PurchaseBuyParams {
  id: number
  number: number
}
export interface PurchaseBuyResponse { }

/// 购买接口参数
function purchaseBuy(data: PurchaseBuyParams) {
  return apiClient.post<PurchaseBuyResponse>('/api/assets/buy', data)
}
interface CollectParams {
  id: number
}
/// 收藏和取消收藏接口参数
function setCollect(data: CollectParams) {
  return apiClient.post<PurchaseBuyResponse>('/api/assets/collect', data)
}
function setUnCollect(data: CollectParams) {
  return apiClient.post<PurchaseBuyResponse>('/api/assets/uncollect', data)
}

export interface CoreTeamResponse {
  id: number
  name: string
  photograph: string
  position: string
  introduce: string
  create_date: number
  update_date: number
}

// 核心团队接口参数
function getCoreTeam() {
  return apiClient.post<CoreTeamResponse>('/api/User/coreTeam')
}

const apiBasic = {
  logins,
  getDataList,
  getDataListDetail,
  getPriceTrend,
  purchaseBuy,
  setCollect,
  setUnCollect,
  getCoreTeam
}

export default apiBasic
