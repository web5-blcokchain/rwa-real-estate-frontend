import type { EIP1193Provider } from '@privy-io/react-auth'
import { ethers } from 'ethers'
import { getUsdcContract } from './usdcAddress'
import { getNameToContract } from './utils'

export async function getPropertyTokenContract(e: EIP1193Provider, address: string) {
  const propertyContract = await getNameToContract(e, 'PropertyToken', address)
  return propertyContract
}

/**
 * 获取资产金额
 * @param e
 * @param address
 * @param userAddress  资产地址
 * @returns
 */
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

/**
 * 获取代币价格
 * @param contact
 * @returns
 */
export async function getTokenPrice(contact: ethers.Contract, e: EIP1193Provider) {
  try {
    const usdcPrice = await contact.issuePrice()
    const usdcContact = await getUsdcContract(e)
    const usdtDecimals = await usdcContact.decimals()
    return Number(ethers.formatUnits(usdcPrice, usdtDecimals))
  }
  catch (e) {
    console.error(`获取代币价格失败:${e}`)
    return 0
  }
}
