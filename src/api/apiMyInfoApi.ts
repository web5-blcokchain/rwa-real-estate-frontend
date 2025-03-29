import apiClient from './client'

interface ResponseData<T> {
  list: any
  code: number
  msg: string
  data: T
  time: number
}

export interface AboutMeParams {
  page?: number
  pageSize?: number
  keyword?: string
}

export interface listProps {
  id: number
  address: string
  property_type: string
  bedrooms: number
  price: number
  monthly_rent: number
  expected_annual_return: number
  rental_yield: number
  capital_appreciation: number
  property_description: string
  location: string
  image_urls: string
  longitude: number | null
  latitude: number | null
  created_date: number
  updated_date: number
  number: number
  area: number
  house_life: number
  postcode: number
  is_collect: number
  total_money: number
}
export interface AboutMeResponse {
  list: listProps[]
  count: number
  page: number
  pageSize: number
}

function getMeInfo(data: AboutMeParams) {
  return apiClient.post<ResponseData<AboutMeResponse>>('/api/assets/myProperties', data)
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

function getHistory() {
  return apiClient.post<ResponseData<historyResponse>>('/api/info/earningsHistory')
}

const apiMyInfoApi = {
  getMeInfo,
  getHistory
}

export default apiMyInfoApi
