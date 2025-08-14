import type { DataListResponse } from './assets'
import apiClient from './client'

export interface PropertyInfo {
  id: number
  name: string
  location: string
  address: string
  property_type: string // 例如 "Land（土地）"
  rental_yield: number | null
  image_urls: string // URL 字符串
  expected_annual_return: string // 年化收益率，字符串形式
  contract_address: string // 合约地址
  token_price: string // 单价（字符串）
  order_type: number // 订单类型
  token_number: number // token数量
  total_amount: string // 总金额
  status: number // 状态码
  sold_number: number // 已售数量
  sell_order_id: string // 卖单 ID
  user_id: number
  properties_id: number
  tokens_held: number // 持有数量
  has_holdings: boolean // 是否有持仓
  total_selling: number // 正在出售的数量
  avatar: string // 头像 URL（可为空）
  nickname: string // 用户昵称/邮箱
  is_me: boolean // 是否本人
  create_date: number
  tx_hash: string
}

export function getInvestmentList(data: {
  page: number
  keyword: string
  type?: string
  order_type?: string
  pageSize: number
  property_type?: number
  price_sort?: number
  is_me?: number
}) {
  return apiClient.post<DataListResponse<PropertyInfo>>('/api/market/marketList', data)
}

export function buyAsset(data: {
  order_market_id: string
  token_number: string
  hash: string
}) {
  return apiClient.post('/api/market/confirmBuy', data)
}

export function sellAsset(data: {
  token_number: string
  sell_order_id: string
  hash: string
  price: string
  id: string
}) {
  return apiClient.post('/api/market/confirmSell', data)
}

export function createBuyOrder(data: {
  id: string
  token_number: string
  token_price: string
  sell_order_id: string
  hash: string
}) {
  return apiClient.post('/api/market/confirmBuyOrder', data)
}

export function sellOrder(data: {
  order_market_id: string
  hash: string
  token_number: string
}) {
  return apiClient.post('/api/market/confirmSellToBuyOrder', data)
}

// 取消订单
export function cancelOrder(order_id: number) {
  return apiClient.post<any>('/api/market/cancelOrder', { order_id })
}
