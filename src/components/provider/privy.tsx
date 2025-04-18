import type { Chain } from 'viem/chains'
import { Env } from '@/lib/global'
import { PrivyProvider } from '@privy-io/react-auth'
import { mainnet } from 'viem/chains'

// 定义本地Hardhat网络
const hardhatLocal: Chain = {
  id: Number.parseInt(Env.web3.chainId),
  name: 'Hardhat Local',
  nativeCurrency: {
    decimals: 18,
    name: 'Ethereum',
    symbol: 'ETH'
  },
  rpcUrls: {
    default: { http: [Env.web3.rpc] }
  }
}

export const AppPrivyProvider: FC = ({ children }) => {
  return (
    <PrivyProvider
      appId={Env.privyAppId}
      config={{
        embeddedWallets: {
          ethereum: {
            createOnLogin: 'all-users'
          }
        },
        supportedChains: [mainnet, hardhatLocal]
      }}
    >
      {children}
    </PrivyProvider>
  )
}
