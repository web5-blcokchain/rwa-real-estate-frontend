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
    '0xDA0e24716328ee0fC99FF834D07EC22C874F936E'
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
    '0x054Fd1041CE021218B743ABB956Be47903533FC9'
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
    '0xbE91B08822c022E4d9238c20c8Fee3b5e9c209d3'
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
    '0x9Bf6a112C5Dc3Eb0B4dC5C91eaeB2CD88b6D54b0'
  )

  return contract
}
