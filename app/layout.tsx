import MainLayout from '@/layouts/main'

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <MainLayout>
      {children}
    </MainLayout>
  )
}
