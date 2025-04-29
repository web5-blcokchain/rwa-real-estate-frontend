export interface TokenHeldItem {
  id: number
  user_id: number
  properties_id: number

  /**
   * token 总数量
   */
  Inception_number: number

  /**
   * 持有的 token 数量
   */
  number: number

  /**
   * 总价值
   */
  total_current: string

  /**
   * token 单价
   */
  current_price: string

  sell_order_id: string
  address: string
  property_type: string
  bedrooms: 10
  expected_annual_return: string
  property_description: string
  location: string
  image_urls: string
  longitude: string
  latitude: string
  name: string
}
