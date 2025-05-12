import { getWeb3Instance } from '@/utils/web3'
import PropertyManager from './PropertyManager.json'
import PropertyToken from './PropertyToken.json'
import RealEstateFacade from './RealEstateFacade.json'
import RealEstateSystem from './RealEstateSystem.json'
import RewardManager from './RewardManager.json'
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
    '0xccf1769D8713099172642EB55DDFFC0c5A444FE9'
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
    '0x3C15538ED063e688c8DF3d571Cb7a0062d2fB18D'
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
    '0xFE5f411481565fbF70D8D33D992C78196E014b90'
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
    '0xcE0066b1008237625dDDBE4a751827de037E53D2'
  )

  return contract
}

/**
 * 获取 RewardManager 合约实例
 * @returns RewardManager 合约实例
 */
export function useRewardManagerContract() {
  const web3 = getWeb3Instance()
  const contract = new web3.eth.Contract(
    RewardManager.abi,
    '0x3904b8f5b0F49cD206b7d5AABeE5D1F37eE15D8d'
  )

  return contract
}

/**
 * 获取 RealEstateSystem 合约实例
 * @returns RealEstateSystem 合约实例
 */
export function useRealEstateSystemContract() {
  const web3 = getWeb3Instance()
  const contract = new web3.eth.Contract(
    RealEstateSystem.abi,
    '0xe039608E695D21aB11675EBBA00261A0e750526c'
  )

  return contract
}
