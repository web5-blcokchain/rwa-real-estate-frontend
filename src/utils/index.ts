/**
 * 验证字符串是否是空字符串，第二个参数为校验规则
 * @param {string} text 字符串
 * @param {object} rule 校验规则
 * @param {string} rule.pattern 校验正则
 * @param {number} rule.min 字符串最大上限
 * @param {number} rule.a 字符串大小下限
 * @returns 是否通过校验
 */
export function verifyStr(text: string, rule?: {
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
