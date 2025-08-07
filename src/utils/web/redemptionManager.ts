import type { EIP1193Provider } from '@privy-io/react-auth'
import type { ethers } from 'ethers'
import { envConfig } from '../envConfig'
import { getPropertyTokenContract } from './propertyToken'
import { getNameToContract, SmartErrorParses } from './utils'
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
export async function redemptionWarningAsset(e: EIP1193Provider, contact: ethers.Contract, userAddress: string, redeemToken: string) {
  try {
    const propertyTokenContract = await getPropertyTokenContract(e, redeemToken)
    // 用户授权给赎回合约，回收房屋代币
    // debugger
    const balance = await propertyTokenContract.balanceOf(userAddress)
    await propertyTokenContract.approve(envConfig.redemptionManagerAddress, balance)
    const tx = await contact.redeemTokens(redeemToken)
    tx.wait()
    return tx
  }
  catch (e) {
    const parsedError = SmartErrorParses.parseError(e)
    console.error('解析内容', parsedError)
    console.error('原始内容', e)
    throw new Error('赎回失败')
  }
}
