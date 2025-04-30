import apiClient from './client'

export function getTransactions(data: Record<string, any>) {
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
