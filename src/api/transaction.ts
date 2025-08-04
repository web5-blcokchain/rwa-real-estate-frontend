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
