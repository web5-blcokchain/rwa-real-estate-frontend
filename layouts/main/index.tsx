'use client'

import RootLayout from '@/layouts/root'
import { usePathname } from 'next/navigation'
import MainFooter from './footer'
import MainHeader from './header'

import '@/layouts/common/globals.css'
import '@/layouts/common/uno.css'

const MainLayout: FC = ({
  children
}) => {
  const pathname = usePathname()
  const isIndex = pathname === '/'

  return (
    <>
      { !isIndex && <MainHeader /> }
      <div className="mx-a max-w-7xl">
        {children}
      </div>
      { !isIndex && <MainFooter /> }
    </>
  )
}

export default MainLayout
