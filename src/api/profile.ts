import apiClient from './client'

export function getCollectList(data: { keyword: string }) {
  return apiClient.post('/api/assets/cancelList', data)
}

export function getOverView() {
  return apiClient.post('/api/info/overView')
}

export function getChartIncomeStatistics(data: {
  data_number: string
}) {
  return apiClient.post('/api/chart/income_statistics', data)
}

export function getChartIncomeTrend(data: {
  type: string
}) {
  return apiClient.post('/api/chart/income_trend', data)
}

export function getEarningList() {
  return apiClient.post('/api/info/earningsHistory')
}

export function reciveEarnings(data: { income_id: string }) {
  return apiClient.post('/api/info/claimIncome', data)
}

export function updateProfile(data: {
  nickname: string
  email: string
  mobile: string
  address: string
  avatar: string
}) {
  return apiClient.post('/api/info/editUser', data)
}

export function redemption(data: {
  id: string
  number: string
}) {
  return apiClient.post('/api/assets/redemption', data)
}

/**
 * 绑定钱包
 * @param data 钱包地址
 * @returns
 */
export function bindWallet(data: { wallet_address: string }) {
  return apiClient.post('/api/info/bindWallet', data)
}
