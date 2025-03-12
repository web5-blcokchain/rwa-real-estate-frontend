import { Env } from '@/lib/global'
import { PrivyProvider } from '@privy-io/react-auth'

export const AppPrivyProvider: FC = ({ children }) => {
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
