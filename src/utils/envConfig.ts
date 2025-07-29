export const envConfig = {
  // API 配置
  apiUrl: import.meta.env.VITE_PUBLIC_API_URL,

  // Privy 配置
  privyAppId: import.meta.env.VITE_PUBLIC_PRIVY_APP_ID,

  // Web3 配置
  web3: {
    rpc: import.meta.env.VITE_PUBLIC_WEB3_RPC_URL,
    chainId: import.meta.env.VITE_PUBLIC_WEB3_CHAIN_ID
  },

  // 链配置
  chainId: import.meta.env.VITE_PUBLIC_WEB3_CHAIN_ID,
  chainName: import.meta.env.VITE_APP_CHAIN_NAME,

  // 原生货币配置
  nativeCurrency: {
    name: import.meta.env.VITE_APP_CHAIN_COIN_NAME,
    symbol: import.meta.env.VITE_APP_CHAIN_COIN_SYMBOL,
    decimals: Number(import.meta.env.VITE_APP_CHAIN_COIN_DECIMALS) || 18
  },

  // RPC URLs
  rpcUrls: import.meta.env.VITE_PUBLIC_WEB3_RPC_URL,

  // 区块浏览器 URLs
  blockExplorerUrl: import.meta.env.VITE_PUBLIC_WEB_BLOCK_URL,

  // USDC 合约地址
  usdcAddress: import.meta.env.VITE_APP_USDC_ADDRESS
}
