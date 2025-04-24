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
 * 通过 Privy 钱包获取 Ethers Signer 实例
 * @param privyWallet Privy 钱包实例
 * @returns Promise<ethers.Signer> Ethers 签名者实例
 */
export async function getSignerFromPrivyWallet(privyWallet: any): Promise<ethers.Signer> {
  if (!privyWallet) {
    throw new Error('钱包未连接')
  }

  try {
    if (privyWallet.provider) {
      // 使用正确的方式创建 Web3Provider 和 Signer
      return new ethers.BrowserProvider(privyWallet.provider).getSigner()
    }
    else if (privyWallet.ethereum) {
      return new ethers.BrowserProvider(privyWallet.ethereum).getSigner()
    }
    else if (typeof privyWallet.getEthereumProvider === 'function') {
      const ethereumProvider = await privyWallet.getEthereumProvider()
      return new ethers.BrowserProvider(ethereumProvider).getSigner()
    }
    else {
      // 使用钱包地址和 JsonRpcProvider 创建 Signer
      console.warn('使用只读钱包签名者，可能无法执行交易')
      // 这不是一个真正能够签名的钱包，但是可以用于读取操作
      return getEthersProvider().getSigner(privyWallet.address)
    }
  }
  catch (error) {
    console.error('从Privy钱包获取Signer失败:', error)
    throw new Error(`获取钱包签名者失败: ${(error as Error).message}`)
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
