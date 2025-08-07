import type { EIP1193Provider } from '@privy-io/react-auth'
import { getNameToContract } from './utils'

export async function getContract(e: EIP1193Provider, address: string) {
  const propertyContract = await getNameToContract(e, 'PropertyToken', address)
  return propertyContract
}

// 获取代币信息
export async function getContactInfo(ethProvider: EIP1193Provider, address: string) {
  const contract = await getContract(ethProvider, address)
  const name = await contract.name()
  const symbol = await contract.symbol()
  const decimals = await contract.decimals()
  return {
    name,
    symbol,
    decimals
  }
}
