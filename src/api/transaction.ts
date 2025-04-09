import apiClient from './client'

export function getTransactionDetail(data: Record<string, any>) {
  return apiClient.post('/api/assets/tokenDistribution', data)
}
