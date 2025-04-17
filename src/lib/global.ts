import ky from 'ky'

export const Env = {
  apiUrl: import.meta.env.VITE_PUBLIC_API_URL,
  privyAppId: import.meta.env.VITE_PUBLIC_PRIVY_APP_ID,
  web3: {
    rpc: import.meta.env.VITE_PUBLIC_WEB3_RPC_URL,
    chainId: import.meta.env.VITE_PUBLIC_WEB3_CHAIN_ID
  }
}

export const Global = {
  api: ky.extend({
    prefixUrl: Env.apiUrl
  })
}
