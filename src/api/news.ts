import type { DataListResponse } from './assets'
import apiClient from './client'

export interface NewsType {
  id: number
  title_zh: string
  title_en: string
  title_jp: string
  weigh: number
  update_time: number
  create_time: number
}
/**
 * 获取新闻分类列表
 * @returns 新闻分类列表
 */
export function getNewsType() {
  return apiClient.get<DataListResponse<NewsType>>('/api/news/getNewsType')
}

export interface NewsItem {
  id: number
  type_id: number
  title_zh: string
  title_en: string
  title_jp: string
  image_zh: string
  image_en: string
  image_jp: string
  desc_zh: string
  desc_en: string
  desc_jp: string
  detail_zh: string | null
  detail_en: string | null
  detail_jp: string | null
  weigh: number
  update_time: number
  create_time: number
  newsType: NewsType
}
/**
 * 获取新闻列表
 * @returns 新闻列表
 */
export function getNews(params: {
  type_id: number
  page: number
  pageSize: number
}) {
  return apiClient.get<{ total: number, list: NewsItem[] }>('/api/news/getNews', {
    params
  })
}

export function getNewsDetail(params: {
  id: number

}) {
  return apiClient.get<NewsItem>('/api/news/getNewsDetail', {
    params
  })
}
