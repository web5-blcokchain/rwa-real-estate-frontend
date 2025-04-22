import { getWeb3Instance } from '@/utils/web3'
import PropertyManager from './PropertyManager.json'
import PropertyToken from './PropertyToken.json'
import RealEstateFacade from './RealEstateFacade.json'
import SimpleERC20 from './SimpleERC20.json'
import TradingManager from './TradingManager.json'

/**
 * 获取 TradingManager 合约实例
 * @returns TradingManager 合约实例
 */
export function useTradingManagerContract() {
  const web3 = getWeb3Instance()
  const contract = new web3.eth.Contract(
    TradingManager.abi,
    '0x905Ad472d7eeB94ed1Fc29D8ff4B53FD4D5a5Eb4'
  )

  return contract
}

/**
 * 获取 PropertyManager 合约实例
 * @returns PropertyManager 合约实例
 */
export function usePropertyManagerContract() {
  const web3 = getWeb3Instance()
  const contract = new web3.eth.Contract(
    PropertyManager.abi,
    '0x2f6f107D4Afd43c451B74DA41A6DDA53D2Bf24B1'
  )

  return contract
}

/**
 * 获取 PropertyToken 合约实例
 * @param contractAddress PropertyToken 合约地址，每个房产都有自己的 PropertyToken 合约
 * @returns PropertyToken 合约实例
 */
export function usePropertyTokenContract(contractAddress?: string) {
  if (!contractAddress)
    return null

  try {
    const web3 = getWeb3Instance()
    const contract = new web3.eth.Contract(
      PropertyToken.abi,
      contractAddress
    )

    return contract
  }
  catch (error) {
    console.error('Failed to get PropertyToken contract:', error)
    return null
  }
}

/**
 * 获取 SimpleERC20 合约实例
 * @returns SimpleERC20 合约实例
 */
export function useSimpleERC20Contract() {
  const web3 = getWeb3Instance()
  const contract = new web3.eth.Contract(
    SimpleERC20.abi,
    '0xeF66010868Ff77119171628B7eFa0F6179779375'
  )

  return contract
}

/**
 * 获取 RealEstateFacade 合约实例
 * @returns RealEstateFacade 合约实例
 */
export function useRealEstateFacadeContract() {
  const web3 = getWeb3Instance()
  const contract = new web3.eth.Contract(
    RealEstateFacade.abi,
    '0x39826E09f8efb9df4C56Aeb9eEC0D2B8164d3B36'
  )

  return contract
}
