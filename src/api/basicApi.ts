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
function getDataList(data: DataListParams) {
  return apiClient.post<DataListResponse>('/api/assets/index', data
    // {
    //     headers: {
    //         "server": true,
    //         "type": type
    //     }
    // }
  )
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

function getDataListDetail(data: DataListDetailParams) {
  return apiClient.post<DetailResponse>('/api/assets/details', data
    // {
    //     headers: {
    //         "server": true,
    //         "type": type
    //     }
    // }
  )
}

interface PurchaseBuyParams {
  id: number
  number: number
}
export interface PurchaseBuyResponse { }

function purchaseBuy(data: PurchaseBuyParams) {
  return apiClient.post<PurchaseBuyResponse>('/api/assets/buy', data
    // {
    //     headers: {
    //         "server": true,
    //         "type": type
    //     }
    // }
  )
}

export interface AboutMeParams {
  page: number
  pageSize: number
  keyword: string
}
export interface AboutMeResponse {

}
function getMeInfo(data: AboutMeParams) {
  return apiClient.post<PurchaseBuyResponse>('/api/assets/myProperties', data)
}

const apiGroup = {
  logins,
  getDataList,
  getDataListDetail,
  purchaseBuy,
  getMeInfo
}

export default apiGroup
