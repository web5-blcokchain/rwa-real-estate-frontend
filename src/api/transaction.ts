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

export function getTransactionDetail(data: Record<string, any>) {
  return apiClient.post('/api/assets/tokenDistribution', data)
}

export function getTransactionStatus(data: Record<string, any>) {
  return apiClient.post('/api/market/orderList', data)
}

export function cancelTransaction(data: {
  order_id: string
}) {
  return apiClient.post('/api/market/cancelOrder', data)
}
