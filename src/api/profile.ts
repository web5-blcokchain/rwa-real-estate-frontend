import apiClient from './client'

export function getOverView(data: Record<string, any>) {
  return apiClient.post('/api/info/overView', data)
}

export function getChartIncomeStatistics() {
  return apiClient.get('/api/chart/income_statistics')
}

export function getChartIncomeTrend() {
  return apiClient.get('/api/chart/income_trend')
}
