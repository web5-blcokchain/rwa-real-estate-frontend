import { Env } from '@/lib/global'
import Web3 from 'web3'

import TradingManager from './TradingManager.json'

export function useTradingManagerContract() {
  const web3 = new Web3(Env.web3.rpc)
  const contract = new web3.eth.Contract(
    TradingManager.abi,
    '0x905Ad472d7eeB94ed1Fc29D8ff4B53FD4D5a5Eb4'
  )

  return contract
}
