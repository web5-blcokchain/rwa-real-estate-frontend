import type { InvestmentOrderType } from '@/enums/investment'

export interface InvestmentItem {
  id: number
  name: string
  location: string
  property_type: string
  contract_address: string
  token_price: string
  tokens_held: number
  total_amount: string
  rental_yield: string
  image_urls: string
  order_type: InvestmentOrderType
}
