import RootLayout from '@/layouts/root'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import { ConfigProvider } from 'antd'

export default function Root({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <RootLayout>
      <AntdRegistry>
        <ConfigProvider theme={{
          token: {
            colorPrimary: '#f5d930'
          }
        }}
        >
          {children}
        </ConfigProvider>
      </AntdRegistry>
    </RootLayout>
  )
}
