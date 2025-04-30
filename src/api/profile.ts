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
  return Promise.resolve({
    code: 1,
    msg: 'success',
    time: 1745931134,
    data: {
      list: [
        {
          id: 1,
          income_date: '2025-03-06 10:19:00',
          type: 1,
          property_name: '喝汤',
          number: 10,
          income_amount: '1000.0000',
          status: 0
        },
        {
          id: 2,
          income_date: '2025-03-06 10:19:00',
          type: 1,
          property_name: '杭州越秀星月城',
          number: 10,
          income_amount: '10000.0000',
          status: 0
        },
        {
          id: 3,
          income_date: '2025-03-06 00:00:00',
          type: 1,
          property_name: '喝汤',
          number: 40,
          income_amount: '39996.0000',
          status: 0
        }
      ],
      count: 3,
      page: 1,
      pageSize: 20
    }
  })

  return apiClient.post('/api/info/earningsHistory')
}

export function reciveEarnings(data: { income_id: string }) {
  return apiClient.post('/api/info/claimIncome', data)
}
