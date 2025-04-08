import apiClient from './client'

export function getOverView(data: Record<string, any>) {
  return apiClient.post('/api/info/overView', data)
}
