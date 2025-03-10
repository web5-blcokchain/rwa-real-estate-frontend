import { ConfigProvider } from 'antd'

export const AntdProvider: FC = ({ children }) => {
  return (
    <ConfigProvider theme={{
      token: {
        colorPrimary: '#f5d930'
      }
    }}
    >
      {children}
    </ConfigProvider>
  )
}
