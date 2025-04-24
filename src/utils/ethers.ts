import { Env } from '@/lib/global'
import { ethers } from 'ethers'

// 存储单例实例
let ethersProviderInstance: ethers.JsonRpcProvider | null = null
let ethersSigner: ethers.Signer | null = null

/**
 * 获取 Ethers Provider 实例（单例模式）
 * @returns ethers.JsonRpcProvider 实例
 */
export function getEthersProvider(): ethers.JsonRpcProvider {
  if (!ethersProviderInstance) {
    // 修复: 使用正确的构造方式创建 JsonRpcProvider
    ethersProviderInstance = new ethers.JsonRpcProvider(Env.web3.rpc)

    // 如果有设置链 ID，确保当前网络是正确的链
    if (Env.web3.chainId) {
      const targetChainId = Number.parseInt(Env.web3.chainId, 10)
      ethersProviderInstance.getNetwork().then((network) => {
        if (Number(network.chainId) !== targetChainId) {
          console.warn(`当前连接的链 ID (${network.chainId}) 与目标链 ID (${targetChainId}) 不匹配`)
        }
      }).catch((error) => {
        console.error('获取网络信息失败:', error)
      })
    }
  }
  return ethersProviderInstance
}

/**
 * 获取 Ethers Signer 实例
 * @returns ethers.Signer 实例
 */
export async function getEthersSigner(): Promise<ethers.Signer> {
  if (!ethersSigner) {
    try {
      // 使用已经创建的 provider
      const provider = getEthersProvider()
      // 对于 JsonRpcProvider，我们不能直接获取 signer，需要配置一个默认账户
      if (!provider) {
        throw new Error('Provider 未初始化')
      }

      // 尝试为 provider 创建一个不带私钥的虚拟 signer (只读操作)
      ethersSigner = await provider.getSigner()
    }
    catch (error) {
      console.warn('无法创建签名者:', error)
      throw new Error('需要连接钱包以获取签名者')
    }
  }
  return ethersSigner!
}

/**
 * 重置 Ethers 实例
 * 在需要强制重新创建连接时调用
 */
export function resetEthersInstances(): void {
  ethersProviderInstance = null
  ethersSigner = null
}

/**
 * 获取合约余额
 * @param contractAddress 合约地址
 * @returns Promise<string> 合约余额（以 ether 为单位）
 */
export async function getContractBalanceEthers(contractAddress: string): Promise<string> {
  try {
    const provider = getEthersProvider()
    const balance = await provider.getBalance(contractAddress)
    return ethers.formatEther(balance)
  }
  catch (error) {
    console.error('获取合约余额失败:', error)
    return '0'
  }
}

/**
 * 创建合约实例
 * @param address 合约地址
 * @param abi 合约ABI
 * @param signerOrProvider Signer或Provider
 * @returns ethers.Contract
 */
export function getEthersContract(address: string, abi: any, signerOrProvider: ethers.Signer | ethers.Provider | null = null) {
  try {
    if (!signerOrProvider) {
      signerOrProvider = getEthersProvider()
    }
    return new ethers.Contract(address, abi, signerOrProvider)
  }
  catch (error) {
    console.error('创建合约实例失败:', error)
    throw new Error(`创建合约实例失败: ${(error as Error).message}`)
  }
}
