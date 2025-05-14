import { getWeb3Instance } from '@/utils/web3'
import PropertyManager from './PropertyManager.json'
import PropertyToken from './PropertyToken.json'
import RealEstateFacade from './RealEstateFacade.json'
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
    '0x645B0f55268eF561176f3247D06d0b7742f79819'
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
    '0x8dF2a20225a5577fB173271c3777CF45305e816d'
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
    '0x226A19c076a3047a53e5430B14bcDB42dbccA159'
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
    '0xf09e7Af8b380cD01BD0d009F83a6b668A47742ec'
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
    '0x8AFB0C54bAE39A5e56b984DF1C4b5702b2abf205'
  )

  return contract
}
