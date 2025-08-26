/**
 * 验证字符串是否是空字符串，第二个参数为校验规则
 * @param {string} text 字符串
 * @param {object} rule 校验规则
 * @param {string} rule.pattern 校验正则
 * @param {number} rule.min 字符串最大上限
 * @param {number} rule.a 字符串大小下限
 * @returns 是否通过校验
 */
export function verifyStr(text: string | undefined, rule?: {
  pattern: RegExp
  min: number
  max: number
}) {
  if (!text || (typeof text === 'string' && text.trim() === ''))
    return false
  if (rule?.pattern && !rule?.pattern?.test(text))
    return false
  if (rule?.min && text.length < rule?.min)
    return false
  if (rule?.max && text.length > rule?.max)
    return false
  return true
}

interface UAInfo {
  device: string
  os: string
  browser: string
  version: string
}
/**
 * 根据请求标识，解析登陆设备
 * @param ua 请求时的标识信息
 * @returns
 */
export function parseUserAgent(ua: string): UAInfo {
  ua = ua.toLowerCase()

  let device = 'Unknown'
  let os = 'Unknown'
  let browser = 'Unknown'
  let version = 'Unknown'

  // ---- 设备 ----
  if (ua.includes('iphone'))
    device = 'iPhone'
  else if (ua.includes('ipad'))
    device = 'iPad'
  else if (ua.includes('android'))
    device = 'Android'
  else if (ua.includes('macintosh'))
    device = 'Mac'
  else if (ua.includes('windows'))
    device = 'Windows PC'
  else if (ua.includes('linux'))
    device = 'Linux PC'

  // ---- 操作系统 ----
  if (ua.includes('windows nt 10.0')) {
    os = 'Windows 10'
  }
  else if (ua.includes('windows nt 6.3')) {
    os = 'Windows 8.1'
  }
  else if (ua.includes('windows nt 6.1')) {
    os = 'Windows 7'
  }
  else if (ua.includes('mac os x')) {
    const match = ua.match(/mac os x ([\d_]+)/)
    if (match) {
      os = `macOS ${match[1].replace(/_/g, '.')}`
    }
    else {
      os = 'macOS'
    }
  }
  else if (ua.includes('android')) {
    const match = ua.match(/android\s+([\d.]+)/)
    os = match ? `Android ${match[1]}` : 'Android'
  }
  else if (ua.includes('iphone os')) {
    const match = ua.match(/iphone os ([\d_]+)/)
    os = match ? `iOS ${match[1].replace(/_/g, '.')}` : 'iOS'
  }

  // ---- 浏览器 ----
  if (ua.includes('chrome')) {
    const match = ua.match(/chrome\/([\d.]+)/)
    browser = 'Chrome'
    version = match ? match[1] : version
  }
  else if (ua.includes('safari') && ua.includes('version')) {
    const match = ua.match(/version\/([\d.]+)/)
    browser = 'Safari'
    version = match ? match[1] : version
  }
  else if (ua.includes('firefox')) {
    const match = ua.match(/firefox\/([\d.]+)/)
    browser = 'Firefox'
    version = match ? match[1] : version
  }
  else if (ua.includes('edg')) {
    const match = ua.match(/edg\/([\d.]+)/)
    browser = 'Edge'
    version = match ? match[1] : version
  }

  return { device, os, browser, version }
}
