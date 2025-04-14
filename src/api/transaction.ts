import apiClient from './client'

export function getTransactions(data: Record<string, any>) {
  return apiClient.post('/api/assets/transactionHistory', data)
}

export function getTransactionDetail(data: Record<string, any>) {
  return apiClient.post('/api/assets/tokenDistribution', data)
}
