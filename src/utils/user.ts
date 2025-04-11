import { TOKEN_KEY, TOKEN_TYPE_KEY } from '@/constants/user'

export function setToken(token: string, type: number) {
  localStorage.setItem(TOKEN_TYPE_KEY, `${type}`)
  localStorage.setItem(TOKEN_KEY, token)
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(TOKEN_TYPE_KEY)
}
