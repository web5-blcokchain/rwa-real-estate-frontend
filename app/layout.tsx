import RootLayout from '@/layouts/root'

export default function Root({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <RootLayout>
      {children}
    </RootLayout>
  )
}
