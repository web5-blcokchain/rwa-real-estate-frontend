import apiClient from './client'

export function getCollectList(data: { keyword: string }) {
  return apiClient.post('/api/assets/cancelList', data)
}

export function getOverView() {
  return apiClient.post('/api/info/overView')
}

export function getChartIncomeStatistics() {
  return apiClient.get('/api/chart/income_statistics')
}

export function getChartIncomeTrend() {
  return apiClient.get('/api/chart/income_trend')
}

export function getEarningList() {
  return apiClient.post('/api/info/earningsHistory')
}

export function reciveEarnings(data: { income_id: string }) {
  return apiClient.post('/api/info/claimIncome', data)
}
