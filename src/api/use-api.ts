import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import { Env } from '@/lib/global'
import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: Env.apiUrl
})

axiosInstance.interceptors.response.use((response) => {
  return response
})

export function setAuthorization(token: string) {
  axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`
}

function handleResponse(response: AxiosResponse) {
  if (response.data.code !== 0) {
    const id = toast.error(response.data.msg || 'An error occurred')
    console.log('toast', id)
    return Promise.reject(response.data)
  }

  return response.data
}

function handleError(error: any) {
  toast.error(_get(error, 'message', 'An error occurred'))
}

async function get(
  path: string,
  params: Record<string, any> = {},
  options: AxiosRequestConfig = {}
) {
  return axiosInstance
    .get(path, {
      params,
      ...options
    })
    .then(handleResponse)
    .catch(handleError)
}

async function post(
  path: string,
  data: Record<string, any> = {},
  options: AxiosRequestConfig = {}
) {
  return axiosInstance
    .post(path, data, options)
    .then(handleResponse)
}

export const request = {
  get,
  post
}
