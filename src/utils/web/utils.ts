import type { EIP1193Provider } from '@privy-io/react-auth'
import { getContracts } from '@/contract'
import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import { envConfig } from '../envConfig'

export async function getUsdcContract(signer: ethers.JsonRpcSigner) {
  const SimpleERC20 = getContracts('SimpleERC20')
  const usdcAddress = envConfig.usdcAddress
  const usdtContract = new ethers.Contract(
    usdcAddress,
    SimpleERC20.abi,
    signer
  )
  return usdtContract
}

export async function generatePermitSignature(
  signer: ethers.JsonRpcSigner,
  token: ethers.Contract,
  spender: string,
  value: bigint,
  deadline: number
) {
  // 获取网络信息

  // 获取代币信息
  const name = await token.name()
  const tokenAddress = await token.getAddress()
  const nonce = await token.nonces(signer.address)

  // 构建 EIP-712 域分隔符
  const domain = {
    name,
    version: '1',
    chainId: Number(envConfig.chainId),
    verifyingContract: tokenAddress
  }

  // 定义 Permit 类型结构
  const types = {
    Permit: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
      { name: 'value', type: 'uint256' },
      { name: 'nonce', type: 'uint256' },
      { name: 'deadline', type: 'uint256' }
    ]
  }

  // 构建签名数据
  const message = {
    owner: signer.address,
    spender,
    value,
    nonce,
    deadline
  }

  console.log('🔐 Permit 签名参数:')
  console.log('  Domain:', domain)
  console.log('  Message:', message)

  // 生成签名
  const signature = await signer.signTypedData(domain, types, message)
  const sig = ethers.Signature.from(signature)

  console.log('  Signature:', { v: sig.v, r: sig.r, s: sig.s })

  return sig
}

export async function getNameToContract(e: EIP1193Provider, contractName: string, address: string) {
  const ethProvider = e || window.ethereum
  const PropertyManager = getContracts(contractName)
  const provider = new ethers.BrowserProvider(ethProvider)
  const signer = await provider.getSigner()
  const propertyContract = new ethers.Contract(
    address,
    PropertyManager.abi,
    signer
  )
  return propertyContract
}

export class SmartErrorParses {
  private static combinedInterface: ethers.Interface | null = null
  private static initialized = false

  /**
   * 从合约中收集所有错误ABI，构建统一的Interface用于错误解析
   */
  static async initialize(contracts: any[]) {
    if (this.initialized)
      return

    // 收集所有合约的错误片段
    const allErrorFragments: any[] = []

    for (const contract of contracts) {
      if (contract.interface && contract.interface.fragments) {
        for (const fragment of contract.interface.fragments) {
          if (fragment.type === 'error') {
            allErrorFragments.push(fragment)
          }
        }
      }
    }

    // 构建包含所有错误的统一Interface
    if (allErrorFragments.length > 0) {
      this.combinedInterface = new ethers.Interface(allErrorFragments)
    }

    this.initialized = true
  }

  /**
   * 解析错误并返回合约定义的错误名称
   * 使用ethers.js原生错误解析，实现真正的自动化
   */
  static parseError(error: any): string {
    // 方案1: 使用ethers.js原生parseError方法（最可靠且自动化）
    if (this.combinedInterface) {
      // 尝试从error.data解析
      if (error.data && typeof error.data === 'string') {
        try {
          const decodedError = this.combinedInterface.parseError(error.data)
          if (decodedError) {
            return decodedError.name
          }
        }
        catch (parseErr) {
          // parseError失败，继续尝试其他方法
          console.error('解析失败', parseErr)
        }
      }

      // 尝试从错误消息中提取错误码并使用parseError
      if (error.message && typeof error.message === 'string') {
        const errorCodeMatch = error.message.match(/return data: (0x[a-fA-F0-9]+)/)
        if (errorCodeMatch) {
          try {
            const decodedError = this.combinedInterface.parseError(errorCodeMatch[1])
            if (decodedError) {
              return decodedError.name
            }
          }
          catch (parseErr) {
            // parseError失败，继续尝试其他方法
            console.error('解析失败', parseErr)
          }
        }
      }
    }

    // 方案2: 从错误消息中提取自定义错误名称（后备方案）
    if (error.message && typeof error.message === 'string') {
      // 匹配自定义错误格式: "reverted with custom error 'ErrorName()'"
      const customErrorMatch = error.message.match(/reverted with custom error '(\w+)(?:\(\))?'/)
      if (customErrorMatch) {
        return customErrorMatch[1]
      }

      // 匹配原因字符串格式: "reverted with reason string 'ErrorMessage'"
      const reasonMatch = error.message.match(/reverted with reason string '([^']+)'/)
      if (reasonMatch) {
        return reasonMatch[1]
      }
    }

    // 方案3: 使用ethers.js的错误解析作为最后后备
    if (error.reason) {
      return error.reason
    }

    // 返回原始错误信息
    return error.message || 'Unknown error'
  }

  /**
   * 计算错误签名（用于调试）
   */
  static calculateErrorSignature(errorName: string): string {
    return ethers.id(`${errorName}()`).substring(0, 10)
  }

  /**
   * 获取已知错误信息（用于调试）
   */
  static getKnownErrors(): string[] {
    if (!this.combinedInterface)
      return []

    const errors: string[] = []
    for (const fragment of this.combinedInterface.fragments) {
      if (fragment.type === 'error') {
        errors.push((fragment as any)?.name)
      }
    }
    return errors
  }
}

// 添加交易确认等待函数，包含重试机制
export async function waitForTransaction(txHash: string, operationName: string, maxRetries: number = 6) {
  console.log(`开始等待${operationName}交易确认: ${txHash}`)
  const provider = new ethers.JsonRpcProvider('https://rpc.ankr.com/bsc/d7e8351e2cfdf87df08764fac115074a3f93f103a88a309a26b110000d628143')
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`${operationName}交易确认尝试 ${attempt}/${maxRetries}`)

      // 获取交易收据
      const receipt = await provider.getTransactionReceipt(txHash)

      if (receipt) {
        if (receipt.status === 1) {
          console.log(`✅ ${operationName}交易成功确认！`)
          return receipt
        }
        else {
          console.error(`❌ ${operationName}交易失败`)
          throw new Error(`${operationName}交易执行失败`)
        }
      }

      // 如果交易收据不存在，等待一段时间后重试
      console.log(`${operationName}交易正在被索引中，等待重试...`)
      await new Promise(resolve => setTimeout(resolve, 3000)) // 等待3秒
    }
    catch (error: any) {
      console.log(`${operationName}交易确认尝试 ${attempt} 失败:`, error.message)

      // 如果是索引错误，继续重试
      if (error.message.includes('transaction indexing is in progress')
        || error.message.includes('could not coalesce error')) {
        if (attempt < maxRetries) {
          console.log(`等待${operationName}交易索引完成，${maxRetries - attempt}次重试剩余`)
          await new Promise(resolve => setTimeout(resolve, 5000)) // 等待5秒
          continue
        }
      }

      // 其他错误或达到最大重试次数
      if (attempt === maxRetries) {
        console.error(`❌ ${operationName}交易确认失败，已达到最大重试次数`)
        throw new Error(`${operationName}交易确认超时，请检查交易状态`)
      }
    }
  }

  throw new Error(`${operationName}交易确认超时`)
}

export function toPlainString18(num: number | string, minDecimals: number = 18) {
  if (!Number(num))
    return '0'
  const bn = new BigNumber(num)

  // 获取原始小数位数
  const decimals = bn.decimalPlaces() || 0

  // 要保留的小数位数，不超过18位，且不少于原始小数位数
  const keepDecimals = Math.min(decimals, minDecimals)

  // toFixed(keepDecimals) 会自动四舍五入并返回字符串，不会用科学计数法
  return bn.toFixed(keepDecimals, BigNumber.ROUND_DOWN)
}
