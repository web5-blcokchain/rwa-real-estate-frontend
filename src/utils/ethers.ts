import { Env } from '@/lib/global'
import { ethers } from 'ethers'

// 存储单例实例
let ethersProviderInstance: ethers.JsonRpcProvider | null = null
let ethersSigner: ethers.Signer | null = null

/**
 * 获取 Ethers Provider 实例（单例模式）
 * @returns ethers.JsonRpcProvider 实例
 */
export async function getEthersProvider(): Promise<ethers.JsonRpcProvider> {
  if (!ethersProviderInstance) {
    // 修复: 使用正确的构造方式创建 JsonRpcProvider
    ethersProviderInstance = new ethers.JsonRpcProvider(Env.web3.rpc)

    const network = await ethersProviderInstance.getNetwork()
    console.log('当前网络', network)

    const targetChainId = Number.parseInt(Env.web3.chainId, 10)
    if (Number(network.chainId) !== targetChainId) {
      console.warn(`当前连接的链 ID (${network.chainId}) 与目标链 ID (${targetChainId}) 不匹配`)
    }
  }

  return ethersProviderInstance
}

export async function ensureEthersNetwork() {
  if (typeof window.ethereum === 'undefined') {
    console.error('未检测到 Web3 钱包（如 MetaMask）')
    return
  }
  const targetChainId = `0x${Number(Env.chainId).toString(16)}`

  try {
    const currentChainId = await window.ethereum.request({ method: 'eth_chainId' })

    if (currentChainId === targetChainId) {
      console.log('已连接到目标网络')
      return
    }

    // 尝试切换到目标网络
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: targetChainId }]
    })
    console.log('成功切换到目标网络')
  }
  catch (switchError: any) {
    // 错误代码 4902 表示钱包中未添加该网络
    if (switchError.code === 4902) {
      try {
        // 尝试添加目标网络
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: targetChainId,
            chainName: Env.chainName,
            rpcUrls: Env.rpcUrls,
            nativeCurrency: {
              name: Env.nativeCurrency.name,
              symbol: Env.nativeCurrency.symbol,
              decimals: Env.nativeCurrency.decimals
            },
            blockExplorerUrls: Env.blockExplorerUrls
          }]
        })
        console.log('成功添加并切换到目标网络')
      }
      catch (addError) {
        console.error('添加网络失败:', addError)
      }
    }
    else {
      console.error('切换网络失败:', switchError)
    }
  }
}

/**
 * 获取 Ethers Signer 实例
 * @returns ethers.Signer 实例
 */
export async function getEthersSigner(): Promise<ethers.Signer> {
  if (!ethersSigner) {
    try {
      // 使用已经创建的 provider
      const provider = await getEthersProvider()
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
    const provider = await getEthersProvider()
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
export async function getEthersContract(address: string, abi: any, signerOrProvider: ethers.Signer | ethers.Provider | null = null) {
  try {
    if (!signerOrProvider) {
      signerOrProvider = await getEthersProvider()
    }
    return new ethers.Contract(address, abi, signerOrProvider)
  }
  catch (error) {
    console.error('创建合约实例失败:', error)
    throw new Error(`创建合约实例失败: ${(error as Error).message}`)
  }
}
