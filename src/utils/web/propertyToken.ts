import type { EIP1193Provider } from '@privy-io/react-auth'
import { ethers } from 'ethers'
import { getNameToContract } from './utils'

export async function getPropertyTokenContract(e: EIP1193Provider, address: string) {
  const propertyContract = await getNameToContract(e, 'PropertyToken', address)
  return propertyContract
}

export async function getPropertyTokenAmount(e: EIP1193Provider, address: string, userAddress: string) {
  try {
    const propertyContract = await getNameToContract(e, 'PropertyToken', address)
    const decimals = await propertyContract.decimals()
    const balance = await propertyContract.balanceOf(userAddress)
    return Number(ethers.formatUnits(balance, decimals))
  }
  catch (e) {
    console.error(`获取资产余额失败:${e}`)
    return 0
  }
}
