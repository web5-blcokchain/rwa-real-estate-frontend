import ky from 'ky'

export const Env = {
  apiUrl: import.meta.env.VITE_PUBLIC_API_URL,
  privyAppId: import.meta.env.VITE_PUBLIC_PRIVY_APP_ID,
  web3: {
    rpc: import.meta.env.VITE_PUBLIC_WEB3_RPC_URL,
    chainId: import.meta.env.VITE_PUBLIC_WEB3_CHAIN_ID
  },
  chainId: import.meta.env.VITE_PUBLIC_WEB3_CHAIN_ID,
  chainName: import.meta.env.VITE_APP_CHAIN_NAME,
  nativeCurrency: {
    name: import.meta.env.VITE_APP_CHAIN_COIN_NAME,
    symbol: import.meta.env.VITE_APP_CHAIN_COIN_SYMBOL,
    decimals: Number(import.meta.env.VITE_APP_CHAIN_COIN_DECIMALS) || 18
  },
  rpcUrls: [import.meta.env.VITE_PUBLIC_WEB3_RPC_URL],
  blockExplorerUrls: [import.meta.env.VITE_PUBLIC_WEB_BLOCK_URL]
}

export const Global = {
  api: ky.extend({
    prefixUrl: Env.apiUrl
  })
}
