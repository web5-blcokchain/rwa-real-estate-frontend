import { TOKEN_KEY, TOKEN_TYPE_KEY } from '@/constants/user'
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
    const token = localStorage.getItem(TOKEN_KEY)
    const type = localStorage.getItem(TOKEN_TYPE_KEY)

    if (token) {
      config.headers.Authorization = token
      config.headers.type = Number.parseInt(type!)
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

axios.interceptors.response.use((res: responseDataParams) => {
  const code = _get(res.data, 'code', 0)

  // 401 账户不存在不需要提示，因为是强制跳转创建账号页面
  if (code !== 401 && code !== 1) {
    const message = _get(res.data, 'msg', 'Response error')
    toast.error(message)
    throw new Error(message)
  }

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
