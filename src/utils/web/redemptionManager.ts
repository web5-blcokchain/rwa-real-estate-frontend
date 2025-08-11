import type { EIP1193Provider } from '@privy-io/react-auth'
import { ethers } from 'ethers'
import { envConfig } from '../envConfig'
import { getPropertyTokenContract, getTokenPrice } from './propertyToken'
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
export async function redemptionWarningAsset(e: EIP1193Provider, contact: ethers.Contract, userAddress: string, redeemToken: string): Promise<{
  tx: ethers.TransactionResponse
  balance: number
}> {
  try {
    const propertyTokenContract = await getPropertyTokenContract(e, redeemToken)
    // 用户授权给赎回合约，回收房屋代币
    // debugger
    const decimals = await propertyTokenContract.decimals()
    const balance = await propertyTokenContract.balanceOf(userAddress)
    await propertyTokenContract.approve(envConfig.redemptionManagerAddress, balance)
    const tx = await contact.redeemTokens(redeemToken)
    tx.wait()
    return {
      tx,
      balance: Number(ethers.formatUnits(balance, decimals))
    }
  }
  catch (e) {
    const error = (e as Error).message
    await SmartErrorParses.initialize([contact])
    const parsedError = SmartErrorParses.parseError(error)
    console.error('解析内容', parsedError)
    console.error('原始内容', JSON.stringify(e), error)
    // 判断是否是取消授权
    if (error.includes('User denied transaction')) {
      throw new Error('400001') // 用户取消授权
    }
    throw new Error('400002') // 钱包操作失败
  }
}

export async function getTokenPriceAndRedemption(e: EIP1193Provider, contact: ethers.Contract, data: {
  /**
   * 房屋代币地址
   */
  propertyToken: string
  /**
   * 用户房屋代币数量
   */
  userTokenAmount: number
}): Promise<{
  /**
   * 投资时代币价格
   */
    currentPrice: number
    /**
     * 用户赎回后的净收益
     */
    netRedemptionAmount: number
    /**
     * 当前代币价格
     */
    nowCurrentPrice: number
  }> {
  try {
    const propertyTokenContract = await getPropertyTokenContract(e, data.propertyToken)
    // 获取代币价格
    const tokenPrice = await getTokenPrice(propertyTokenContract)
    // 获取代币精度
    const decimals = await propertyTokenContract.decimals()
    const tx = await contact.getTokenPriceAndRedemption(data.propertyToken, ethers.parseUnits(data.userTokenAmount.toString(), decimals))
    return {
      nowCurrentPrice: Number(ethers.formatUnits(tx[0], decimals)),
      netRedemptionAmount: Number(ethers.formatUnits(tx[1], decimals)),
      currentPrice: tokenPrice
    }
  }
  catch (e: any) {
    console.error(e)
    throw new Error(e)
  }
}
