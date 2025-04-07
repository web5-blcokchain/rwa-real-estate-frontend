import { TokenHeaderName } from '@/constants/setting'
import { Env } from '@/lib/global'
import axios from 'axios'

axios.defaults.baseURL = Env.apiUrl
axios.defaults.headers.common.server = true

interface responseDataParams {
  code?: number
  data?: any
  error?: any
}

axios.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem('privy:token')?.replace(/"/g, '') || localStorage.getItem(TokenHeaderName)
    const type = localStorage.getItem('privy:token') ? 2 : 1
    if (token) {
      config.headers.Authorization = token
    }

    config.headers.type = type
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

axios.interceptors.response.use((res: responseDataParams) => {
  return res.data
})

const apiClient = {
  get: axios.get,
  put: axios.put,
  post: axios.post,
  delete: axios.delete,
  patch: axios.patch
}

export default apiClient
