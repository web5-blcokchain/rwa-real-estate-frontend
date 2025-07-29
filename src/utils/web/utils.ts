import { getContracts } from '@/contract'
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
