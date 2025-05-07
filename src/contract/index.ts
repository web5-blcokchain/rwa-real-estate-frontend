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
    '0x0165878A594ca255338adfa4d48449f69242Eb8F'
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
    '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9'
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
    '0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0'
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
    '0x68B1D87F95878fE05B998F19b66F4baba5De1aed'
  )

  return contract
}
