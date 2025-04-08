import apiClient from './client'

export function getOverView() {
  return apiClient.post('/api/info/overView')
}

export function getChartIncomeStatistics() {
  return apiClient.get('/api/chart/income_statistics')
}

export function getChartIncomeTrend() {
  return apiClient.get('/api/chart/income_trend')
}
