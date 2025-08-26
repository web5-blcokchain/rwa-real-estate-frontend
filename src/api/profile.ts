import type { DataListResponse } from './assets'
import apiClient from './client'

export function getCollectList(data: { keyword: string }) {
  return apiClient.post('/api/assets/cancelList', data)
}

export function getOverView() {
  return apiClient.post('/api/info/overView')
}

export function getChartIncomeStatistics(data: {
  data_number: string
}) {
  return apiClient.post('/api/chart/income_statistics', data)
}

export function getChartIncomeTrend(data: {
  type: string
}) {
  return apiClient.post('/api/chart/income_trend', data)
}

export function getEarningList() {
  return apiClient.post('/api/info/earningsHistory')
}

export function reciveEarnings(data: { income_id: string }) {
  return apiClient.post('/api/info/claimIncome', data)
}

export function updateProfile(data: {
  nickname: string
  email: string
  mobile: string
  address: string
  avatar: string
}) {
  return apiClient.post('/api/info/editUser', data)
}

export function redemption(data: {
  id: string
  number: string
}) {
  return apiClient.post('/api/assets/redemption', data)
}

/**
 * 绑定钱包
 * @param data 钱包地址
 * @returns
 */
export function bindWallet(data: { wallet_address: string }) {
  return apiClient.post('/api/info/bindWallet', data)
}

export interface MessageListResponse {
  list: Notification[]
  count: number
  page: number
  pageSzie: number
  unread: number
}

export interface Notification {
  id: number
  user_id: number
  type: string
  title: string
  content: string
  status: number
  extra: string
  create_time: string // 建议用 string，如果要做时间处理可以转成 Date
}

export interface MessageListParams {
  page: number
  pageSize: number
  status?: number
  data_start?: string
  date_end?: string
  keyword?: string
  type?: number
}

/**
 * 获取消息列表
 * @param data
 * @param {number} data.page 页码
 * @param {number} data.pageSize 每页数量
 * @param {number} data.state 状态 0 未读 1为已读
 * @param {string} data.date_start 开始时间 {2025-04-01}
 * @param {string} data.date_end 结束时间 {2025-04-01}
 * @param {string} data.keyword 模糊搜索
 * @param {number} data.type 消息类型 1.kyc通过 2.资产违约 3.c2c交易
 * @returns MessageListParams
 */
export function getMessageList(data: MessageListParams) {
  return apiClient.post<MessageListResponse>('/api/info/messageList', data)
}

/**
 * 已读消息
 * @param data
 * @param {number[]} data.ids 消息id
 * @returns MessageListResponse
 */
export function readUserMessage(data: {
  ids: number[]
}) {
  return apiClient.post<any>('/api/info/markMessageRead', data)
}

export interface SubmitAppealData {
  appeal_type: string
  appeal_reason: string
  proof_files: string
  real_name: string
  contact_phone: string
  email: string
}
/**
 * 提交申诉信息
 * @param data
 * @param {string} data.appeal_type 申诉类型 1-交易类型实际未到账，2-金额不符，3-其他问题
 * @param {string} data.appeal_reason 申诉内容
 * @param {string} data.proof_files 申诉凭证文件
 * @param {string} data.real_name 真实姓名
 * @param {string} data.contact_phone 联系方式
 * @param {string} data.email 邮箱
 * @returns any
 */
export function submitAppeal(data: SubmitAppealData) {
  return apiClient.post<any>('/api/info/submitAppeal', data)
}

/**
 * 记录登录日志
 * @returns any
 */
export function recordLoginLog() {
  return apiClient.post('/api/info/recordLoginLog')
}

export interface LoginLog {
  id: number
  ip: string
  login_date: number
  agent: string
}

/**
 * 获取登录日志列表
 * @param {number} data.page 页码
 * @param {number} data.pageSize 页大小
 * @param data
 * @returns any
 */
export function getLoginLogList(data: {
  page: number
  pageSize: number
}) {
  return apiClient.post<DataListResponse<LoginLog>>('/api/info/getLoginLogList', data)
}
