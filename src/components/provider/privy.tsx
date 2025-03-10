import { Env } from '@/lib/global'
import { PrivyProvider } from '@privy-io/react-auth'

export const AppPrivyProvider: FC = ({ children }) => {
  // TODO: 添加 Privy
  return (
    <>
      {children}
    </>
  )

  return (
    <PrivyProvider
      appId={Env.privyAppId}
      config={{
        appearance: {
          walletList: ['phantom']
        }
      }}
    >
      {children}
    </PrivyProvider>
  )
}
