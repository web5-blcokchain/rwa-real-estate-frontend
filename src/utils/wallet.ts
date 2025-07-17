import type { ConnectedWallet } from '@privy-io/react-auth'
import { getContracts } from '@/contract'
import { ethers } from 'ethers'

export function shortAddress(address: string) {
  if (!address) {
    return ''
  }

  if (address.length < 10)
    return address
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

// 获取代币信息
export async function getTokenInfo(wallet: ConnectedWallet, contractAddress: string): Promise<{
  symbol: string
  decimals: number
  name: string
}> {
  if (!wallet)
    return {} as any
  const PropertyManager = getContracts('PropertyToken')
  const ethProvider = await wallet.getEthereumProvider()
  const provider = new ethers.BrowserProvider(ethProvider)
  const signer = await provider.getSigner()
  // PropertyManager合约
  const propertyManagerContract = new ethers.Contract(
    contractAddress,
    PropertyManager.abi,
    signer
  )
  const symbol = await propertyManagerContract.symbol()
  const name = await propertyManagerContract.name()
  const decimals = await propertyManagerContract.decimals()
  return {
    symbol,
    decimals,
    name
  }
}

// 添加代币地址到钱包
export async function addTokenToWallet(wallet: ConnectedWallet, contractAddress: string) {
  if (!wallet)
    return
  const { symbol, decimals } = await getTokenInfo(wallet, contractAddress)
  try {
    const wasAdded = await window.ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20', // 目前仅支持 ERC20
        options: {
          address: contractAddress,
          symbol,
          decimals: Number(decimals)
        }
      }
    })

    if (wasAdded) {
      console.log('Token added successfully!')
    }
    else {
      console.log('Token addition rejected by user.')
    }
  }
  catch (error) {
    console.error('Failed to add token:', error)
  }
}
