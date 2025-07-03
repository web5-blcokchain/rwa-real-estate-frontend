import { useLocation } from '@tanstack/react-router'
import MainFooter from './footer'
import MainHeader from './header'

const MainLayout: FC = ({
  children
}) => {
  const { pathname } = useLocation()
  const isIndex = pathname === '/'

  return (
    <>
      { !isIndex && <MainHeader /> }
      <div className="mx-a min-h-screen">
        {children}
      </div>
      { !isIndex && <MainFooter /> }
    </>
  )
}

export default MainLayout
