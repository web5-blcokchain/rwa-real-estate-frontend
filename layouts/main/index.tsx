'use client'

import { usePathname } from 'next/navigation'
import MainFooter from './footer'
import MainHeader from './header'

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
