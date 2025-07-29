import apiClient from './client'

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
  annual_return_max: string
  annual_return_min: string
  Inception_number: number
  address: string
  area: string
  contract_address: string
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
  is_collect: 0 | 1
  token_name: string
  token_symbol: string
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
  return apiClient.post<Array<PriceTrendResponse>>('/api/chart/price_trend')
}

export interface analysisResponse {
  cost: string
  id: number
  quarter: string
}

// 运行成本分析
function getCostAnalysis() {
  return apiClient.post<Array<analysisResponse>>('/api/chart/operating_cost_analysis')
}

interface PurchaseBuyParams {
  id: number
  number: number
  hash: string
}

export interface PurchaseBuyResponse { }

// 购买接口参数
function initialBuyAsset(data: PurchaseBuyParams) {
  return apiClient.post<number>('/api/assets/buy', data)
}

interface CollectParams {
  id: string
}

// 收藏和取消收藏接口参数
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
  getDataList,
  getDataListDetail,
  getPriceTrend,
  getCostAnalysis,
  initialBuyAsset,
  setCollect,
  setUnCollect,
  getCoreTeam
}

export default apiBasic
