import numbro from 'numbro'
import { toPlainString18 } from './web/utils'

/**
 * 格式化数字，整数用 numbro，小数部分最长保留 {mantissa} 位,最小保留 {min} 位,自动截断末尾的0
 * @param {number|string} value - 要处理的值
 * @returns {string}
 */
export function formatNumberNoRound(value: number | string | undefined, mantissa: number = 0, min: number = 0, format?: numbro.Format): string {
  value = Number(value)
  if (value === 0 || typeof value !== 'number')
    return '0'
  if (value === null || Number.isNaN(value)) {
    return '0.00' // 防止传空或者非法值
  }
  let decimals = value.toString().split('.')[1] || ''
  decimals = decimals.slice(0, mantissa).replace(/0+$/, '')

  // decimals = decimals.padEnd(2,'0')
  decimals = decimals.slice(0, Math.max(Math.min(mantissa, decimals.length), min))
  // 如果出现了科学技术法，则用bignumber
  if (value.toString().includes('e')) {
    return toPlainString18(value)
  }
  return numbro(Number.parseInt(value.toString())).format({
    mantissa: 0,
    // mantissa:mantissa,
    thousandSeparated: true,
    ...format
  }) + (decimals.length > 0 ? `.${decimals}` : '')
}
