import type { EIP1193Provider } from '@privy-io/react-auth'
import { getContracts } from '@/contract'
import { Contract, ethers } from 'ethers'
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
    const approveTx = await propertyTokenContract.approve(envConfig.redemptionManagerAddress, balance)
    await approveTx.wait()
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

/**
 * 获取赎回价格信息
 * @param e
 * @param contact
 * @param data
 * @returns
 */
export async function getTokenPriceAndRedemption(e: EIP1193Provider | ethers.WebSocketProvider, data: {
  /**
   * 房屋代币地址
   */
  propertyToken: string
  /**
   * 用户地址
   */
  userAddress: string
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
    /**
     * 房屋代币余额
     */
    userTokenAmount: number
  }> {
  try {
    const propertyContractAbi = getContracts('PropertyToken')
    // 如果没有连接钱包，则通过远程连接op网络获取合约
    const propertyContract = new Contract(data.propertyToken, propertyContractAbi.abi, e as any)
    // 获取用户代币余额
    const tokenDecimals = await propertyContract.decimals()
    const tokenBalance = await propertyContract.balanceOf(data.userAddress)
    // 获取之前代币价格
    const oldUsdcPrice = await propertyContract.issuePrice()
    // 获取代币精度
    const usdcContractAbi = await getContracts('SimpleERC20')
    const usdcContract = await new Contract(envConfig.usdcAddress, usdcContractAbi.abi, e as any)
    const usdcDecimals = await usdcContract.decimals()
    const redemptionContractAbi = getContracts('RedemptionManager')
    const redemptionContract = new Contract(envConfig.redemptionManagerAddress, redemptionContractAbi.abi, e as any)
    const tx = await redemptionContract.getTokenPriceAndRedemption(data.propertyToken, tokenBalance)
    return {
      nowCurrentPrice: Number(ethers.formatUnits(tx[0], usdcDecimals)),
      netRedemptionAmount: Number(ethers.formatUnits(tx[1], usdcDecimals)),
      currentPrice: Number(ethers.formatUnits(oldUsdcPrice, usdcDecimals)),
      userTokenAmount: Number(ethers.formatUnits(tokenBalance, tokenDecimals))
    }
  }
  catch (e: any) {
    console.error(e)
    throw new Error(e)
  }
}
