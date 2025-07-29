import { getContracts } from '@/contract'
import { ethers } from 'ethers'
import { envConfig } from '../envConfig'

/**
 * 获取合约实例
 * @param provider
 * @returns
 */
export function getContractInstance(provider: ethers.BrowserProvider) {
  const RentCustodyContract = getContracts('RentCustodyContract')
  return new ethers.Contract(envConfig.rentCustodyAddress, RentCustodyContract.abi, provider)
}

export async function getHouseBalance(provider: ethers.BrowserProvider, houseId: number) {
  const contract = getContractInstance(provider)
  const balance = await contract.getHouseBalance(houseId)
  return Number(String(balance))
}
