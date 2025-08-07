import type { EIP1193Provider } from '@privy-io/react-auth'
import { envConfig } from '../envConfig'
import { getNameToContract } from './utils'

export async function getUsdcContract(e: EIP1193Provider) {
  const propertyContract = await getNameToContract(e, 'SimpleERC20', envConfig.usdcAddress)
  return propertyContract
}

// 获取代币信息
export async function getContactInfo(ethProvider: EIP1193Provider) {
  const contract = await getUsdcContract(ethProvider)
  const name = await contract.name()
  const symbol = await contract.symbol()
  const decimals = await contract.decimals()
  return {
    name,
    symbol,
    decimals
  }
}
