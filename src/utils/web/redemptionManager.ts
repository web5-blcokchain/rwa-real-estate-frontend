import type { EIP1193Provider } from '@privy-io/react-auth'
import type { ethers } from 'ethers'
import { envConfig } from '../envConfig'
import { getNameToContract } from './utils'

/**
 * 获取赎回合约实例
 * @param e
 * @param address 用户地址
 * @returns
 */
export async function getRedemptionManagerContract(e: EIP1193Provider) {
  const propertyContract = await getNameToContract(e, 'RedemptionManager', envConfig.redemptionManagerAddress)
  return propertyContract
}

/**
 * 赎回房屋代币交易
 * @param contact 合约
 * @param redeemTokens 房屋代币地址
 * @returns
 */
export async function redemptionWarningAsset(contact: ethers.Contract, redeemTokens: string) {
  try {
    const tx = await contact.redeemTokens(redeemTokens)
    return tx
  }
  catch (e) {
    console.error(e)
    throw new Error('赎回失败')
  }
}
