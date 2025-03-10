import { AntdProvider } from './antd'
import { AppPrivyProvider } from './privy'
import { AppQueryClientProvider } from './react-query'

export const AppProviders: FC = ({ children }) => {
  // force light theme
  return (
    <AntdProvider>
      <AppQueryClientProvider>
        <AppPrivyProvider>
          {children}
        </AppPrivyProvider>
      </AppQueryClientProvider>
    </AntdProvider>
  )
}
