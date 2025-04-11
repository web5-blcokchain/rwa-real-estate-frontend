import apiClient from './client'

export function getInvestmentList(data: {
  page: number
  keyword: string
}) {
  return apiClient.post('/api/market/marketList', data)
}
