import apiClient from './client'

export function getInvestmentList(data: {
  page: number
  keyword: string
}) {
  return apiClient.post('/api/market/marketList', data)
}

export function buyAsset(data: {
  order_market_id: number
}) {
  return apiClient.post('/api/market/confirmBuy', data)
}

export function sellAsset(data: {
  order_market_id: number
}) {
  return apiClient.post('/api/market/confirmSell', data)
}
