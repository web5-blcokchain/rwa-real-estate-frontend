import { TOKEN_KEY, TOKEN_LANG_KEY, TOKEN_TYPE_KEY } from '@/constants/user'
import { eventBus } from '@/hooks/EventBus'
import { Env } from '@/lib/global'
import axios from 'axios'

axios.defaults.baseURL = Env.apiUrl
axios.defaults.headers.common.server = true

export interface ResponseData<T> {
  code?: number
  data?: T
  msg?: string
  time?: number
}

axios.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem(TOKEN_KEY)
    const type = localStorage.getItem(TOKEN_TYPE_KEY)
    const lang = localStorage.getItem(TOKEN_LANG_KEY) || 'en'
    if (token) {
      config.headers.Authorization = token
      config.headers.type = Number.parseInt(type!)
      config.headers['think-lang'] = lang!
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

const errorList: { message: string, time: number }[] = []
axios.interceptors.response.use(async (res: ResponseData<any>) => {
  const code = _get(res.data, 'code', 0)
  // 401 账户不存在不需要提示，因为是强制跳转创建账号页面 TODO Expired token
  let fullUrl = ''
  const config = (res as any).config
  if (config)
    fullUrl = config.url
  if (code === 401 && fullUrl.includes('/api/info/userInfo')) {
    return res.data
  }
  const lang = localStorage.getItem(TOKEN_LANG_KEY) || 'en'
  const defaultMessage = lang === 'en' ? 'Response error' : lang === 'ja' ? 'エラーが発生しました' : 'Response error'
  if (code !== 1 && code !== 401) {
    const message = _get(res.data, 'msg', defaultMessage)
    if (message.includes('Token is expired') || message.includes('Expired token')) { // 触发全局事件总线，重新获取token
      eventBus.emit('tokenExpired', { msg: 'Token is expired' })
      return
    }
    // 同一个提示信息一段时间只出现一次
    const hasError = errorList.some(item => item.message === message && item.time > Date.now() - 5000)
    if (!hasError) {
      toast.error(message)
      errorList.push({ message, time: Date.now() })
    }
    throw new Error(message)
  }

  return res.data
})

type ApiClientMethod = <T = any>(url: string, params?: any) => Promise<ResponseData<T>>
type Methods = 'get' | 'put' | 'post' | 'delete' | 'patch'

const apiClient: Record<Methods, ApiClientMethod> = {
  get: axios.get,
  put: axios.put,
  post: axios.post,
  delete: axios.delete,
  patch: axios.patch
}

export default apiClient
