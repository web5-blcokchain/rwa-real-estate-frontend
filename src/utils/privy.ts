import type { ConnectedWallet } from '@privy-io/react-auth'
import { goChain } from '@/components/provider/privy'
import { Env } from '@/lib/global'

let switching = false

export async function ensurePrivyNetwork(wallet: ConnectedWallet) {
  if (switching) {
    return
  }

  switching = true

  try {
    // 尝试切换到目标链
    await wallet.switchChain(Number.parseInt(Env.web3.chainId))
    console.log('成功切换到 Hardhat 网络')
  }
  catch (switchError: any) {
    // 如果目标链未添加，添加新链
    if (switchError.code === 4902) {
      const provider = await wallet.getEthereumProvider()
      try {
        await provider.request({
          method: 'wallet_addEthereumChain',
          params: [goChain]
        })
        console.log('成功添加并切换到 Hardhat 网络')
      }
      catch (addError) {
        console.error('添加 Hardhat 网络失败:', addError)
      }
    }
  }
  finally {
    switching = false
  }
}
