import { Env } from '@/lib/global'
import Web3 from 'web3'

import TradingManager from './TradingManager.json'

export function useTradingManagerContract() {
  const web3 = new Web3(Env.web3.rpc)
  const contract = new web3.eth.Contract(
    TradingManager.abi,
    '0x01E21d7B8c39dc4C764c19b308Bd8b14B1ba139E'
  )

  return contract
}
