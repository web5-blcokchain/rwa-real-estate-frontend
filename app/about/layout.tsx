import MainLayout from '@/layouts/main'

export default function HomeLayout({
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
