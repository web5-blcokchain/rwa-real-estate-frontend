import { Env } from '@/lib/global'
import Web3 from 'web3'

// 存储单例实例
let web3Instance: Web3 | null = null

/**
 * 获取 Web3 实例（单例模式）
 * @returns Web3 实例
 */
export function getWeb3Instance(): Web3 {
  if (!web3Instance) {
    // 使用全局配置的 RPC URL
    const provider = new Web3.providers.HttpProvider(Env.web3.rpc)
    web3Instance = new Web3(provider)

    // 如果有设置链 ID，确保当前网络是正确的链
    if (Env.web3.chainId) {
      web3Instance.eth.getChainId().then((currentChainId) => {
        const targetChainId = Number.parseInt(Env.web3.chainId, 10)
        if (Number(currentChainId) !== targetChainId) {
          console.warn(`当前连接的链 ID (${currentChainId}) 与目标链 ID (${targetChainId}) 不匹配`)
        }
      }).catch((error) => {
        console.error('获取链 ID 失败:', error)
      })
    }
  }
  return web3Instance
}

/**
 * 重置 Web3 实例
 * 在需要强制重新创建连接时调用
 */
export function resetWeb3Instance(): void {
  web3Instance = null
}

/**
 * 获取合约余额
 * @param contractAddress 合约地址
 * @returns Promise<string> 合约余额（以 ether 为单位）
 */
export async function getContractBalance(contractAddress: string): Promise<string> {
  try {
    const web3 = getWeb3Instance()
    const balance = await web3.eth.getBalance(contractAddress)
    return web3.utils.fromWei(balance, 'ether')
  }
  catch (error) {
    console.error('获取合约余额失败:', error)
    return '0'
  }
}
