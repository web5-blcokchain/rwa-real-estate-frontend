import type { EIP1193Provider } from '@privy-io/react-auth'
import { getContracts } from '@/contract'
import { ethers } from 'ethers'

export async function getContract(e: EIP1193Provider, address: string) {
  const ethProvider = e || window.ethereum
  const PropertyManager = getContracts('PropertyToken')
  const provider = new ethers.BrowserProvider(ethProvider)
  const signer = await provider.getSigner()
  const propertyContract = new ethers.Contract(
    address,
    PropertyManager.abi,
    signer
  )
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
