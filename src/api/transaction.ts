import type { ResponseData } from './client'
import apiClient from './client'

interface transactionHistory {
  create_date: number
  name: string
  type: number
  price: string
  number: number
  status: number
  total_money: string
}

export interface DataListResponse<T> {
  count: number
  list: T[]
  page: number
  pageSize: number
}
export function getTransactions(data: Record<string, any>): Promise<ResponseData<DataListResponse<transactionHistory>>> {
  return apiClient.post('/api/assets/transactionHistory', data)
}

interface TransactionDetail {
  token: {
    type: string
    receiving_amount: number
    payment_status: string
    payment_amount: string
    smart_contract_address: string
    token_contract_address: string
    estimated_execution_time: string
    expected_annual_return: string
    annual_return_max: string
    annual_return_min: string

  }
  property: {
    name: string
    location: string
    registration_number: string
    annual_yield: string
    audit: string
    token_name: string
  }
  transaction: {
    status: string
    estimated_arrival_time: string
    hash: string
    block_confirmation: string
  }

}
export function getTransactionDetail(data: Record<string, any>) {
  return apiClient.post<TransactionDetail>('/api/assets/tokenDistribution', data)
}

export function getTransactionStatus(data: Record<string, any>) {
  return apiClient.post('/api/market/orderList', data)
}

export function cancelTransaction(data: {
  order_id: string
}) {
  return apiClient.post('/api/market/cancelOrder', data)
}

export interface OrderTransaction {
  name: string // 名称
  property_type: string // 房产类型 (这里是 "6"，所以用 string)
  price: string // 单价，字符串形式
  number: number // 数量
  total_money: string // 总金额，字符串形式
  status: number // 状态
  create_date: number // 创建时间（时间戳）
  type: number // 类型
  hash: string // 交易哈希
  order_market_id: number// 市场订单 ID
  properties_id: number
}

/**
 * 获取C2C 购买记录
 */
export function marketTransactionHistory(data: {
  /**
   * 当前也
   */
  page: number
  /**
   * 每页数量
   */
  pageSize: number
  /**
   * 资产名称
   */
  address: string
  /**
   * 交易类型 3为出售 4未购买
   */
  type?: number
  /**
   * 资产类型id
   */
  property_type?: number
}) {
  return apiClient.post<DataListResponse<OrderTransaction>>('/api/market/transactionHistory', data)
}
