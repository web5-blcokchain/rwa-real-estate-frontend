import apiClient from './client'

export function getInvestmentList(data: {
  page: number
  keyword: string
  type?: string
  order_type: string
  pageSize: number
}) {
  return apiClient.post('/api/market/marketList', data)
}

export function buyAsset(data: {
  order_market_id: string
  token_number: string
  hash: string
}) {
  return apiClient.post('/api/market/confirmBuy', data)
}

export function sellAsset(data: {
  token_number: string
  sell_order_id: string
  hash: string
  price: string
  id: string
}) {
  return apiClient.post('/api/market/confirmSell', data)
}

export function createBuyOrder(data: {
  id: string
  token_number: string
  token_price: string
  sell_order_id: string
  hash: string
}) {
  return apiClient.post('/api/market/confirmBuyOrder', data)
}

export function sellOrder(data: {
  order_market_id: string
  hash: string
  token_number: string
}) {
  return apiClient.post('/api/market/confirmSellToBuyOrder', data)
}
