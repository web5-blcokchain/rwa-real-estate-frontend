import { ConfigProvider, theme } from 'antd'

const { darkAlgorithm } = theme

export const AntdProvider: FC = ({ children }) => {
  return (
    <ConfigProvider theme={{
      token: {
        colorPrimary: '#f5d930'
      },
      algorithm: [darkAlgorithm]
    }}
    >
      {children}
    </ConfigProvider>
  )
}
