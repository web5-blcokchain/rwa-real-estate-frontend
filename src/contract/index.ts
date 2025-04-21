import { getWeb3Instance } from '@/utils/web3'
import PropertyManager from './PropertyManager.json'
import SimpleERC20 from './SimpleERC20.json'
import TradingManager from './TradingManager.json'

export function useTradingManagerContract() {
  const web3 = getWeb3Instance()
  const contract = new web3.eth.Contract(
    TradingManager.abi,
    '0x905Ad472d7eeB94ed1Fc29D8ff4B53FD4D5a5Eb4'
  )

  return contract
}

export function usePropertyManagerContract() {
  const web3 = getWeb3Instance()
  const contract = new web3.eth.Contract(
    PropertyManager.abi,
    '0x2f6f107D4Afd43c451B74DA41A6DDA53D2Bf24B1'
  )

  return contract
}

export function useSimpleERC20Contract() {
  const web3 = getWeb3Instance()
  const contract = new web3.eth.Contract(
    SimpleERC20.abi,
    '0xeF66010868Ff77119171628B7eFa0F6179779375'
  )

  return contract
}
