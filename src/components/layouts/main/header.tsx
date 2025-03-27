import { usePrivy } from '@privy-io/react-auth'
import { Link, useLocation } from '@tanstack/react-router'
import { Button, Drawer } from 'antd'

const links = [
  { title: 'Home', href: '/home' },
  { title: 'Properties', href: '/properties' },
  { title: 'Investment', href: '/investment' },
  { title: 'About', href: '/about' },
  { title: 'AboutMe', href: '/aboutMe' }
]

export default function MainHeader() {
  const [open, setOpen] = useState(false)

  const showDrawer = () => {
    setOpen(true)
  }

  const onClose = () => {
    setOpen(false)
  }

  return (
    <header className="sticky left-0 top-0 z-10 h-32 fbc bg-background px-8 text-text">
      <div className="fyc gap-8">
        <div className="text-5 text-primary">Real Estate RWA</div>
        <NavMenu className="fyc gap-8 lt-md:hidden" />
      </div>

      <div className="fyc gap-4 lt-lg:hidden">
        <RightMenu />
      </div>

      <div className="hidden lt-lg:flex">
        <div className="i-material-symbols-menu-rounded size-10" onClick={showDrawer}></div>
      </div>

      <Drawer
        className="bg-background! bg-opacity-75! backdrop-blur-md!"
        closeIcon={false}
        width="100%"
        onClose={onClose}
        open={open}
      >
        <div className="space-y-6">
          <div className="fec">
            <div
              className="i-material-symbols-light-close-rounded size-10 bg-white"
              onClick={onClose}
            >
            </div>
          </div>
          <div className="fec gap-4">
            <RightMenu />
          </div>

          <NavMenu
            className={cn(
              'flex flex-col items-end justify-center gap-6',
              'text-6'
            )}
          />
        </div>
      </Drawer>
    </header>
  )
}

function NavMenu({ className }: { className?: string }) {
  const { pathname } = useLocation()

  return (
    <nav className={cn(
      'text-4',
      className
    )}
    >
      {
        links.map((link, i) => (
          <Link
            key={i}
            href={link.href}
            className={cn(
              'cursor-pointer active:text-primary hover:text-primary',
              pathname === link.href ? 'text-text' : 'text-[#8d909a]'
            )}
            to="/about"
          >
            {link.title}
          </Link>
        ))
      }
    </nav>
  )
}

function RightMenu() {
  const [, setLanguage] = useState(i18n.language)

  const { ready, authenticated, user, login, logout } = usePrivy()

  useEffect(() => {
    console.log('user', user)
  }, [])

  useEffect(() => {
    const handleLanguageChange = () => {
      setLanguage(i18n.language)
    }

    // 监听语言变化事件
    i18n.on('languageChanged', handleLanguageChange)

    // 清理事件监听
    return () => {
      i18n.off('languageChanged', handleLanguageChange)
    }
  }, [])

  return (
    <>
      <div className="fyc gap-1">
        <div className="i-majesticons-globe-line size-5 bg-white"></div>
        <div className="text-4 text-white">English</div>
        <div className="i-ic-round-keyboard-arrow-down size-5 bg-white"></div>
      </div>

      <div className="i-material-symbols-help-outline size-5 bg-white"></div>
      <div className="i-material-symbols-notifications-outline size-5 bg-white"></div>
      <div className="i-material-symbols-favorite-outline-rounded size-5 bg-white"></div>

      <Waiting for={ready}>
        {
          authenticated
            ? (
                <div className="fyc gap-1" onClick={logout}>
                  <div className="i-material-symbols-account-circle-outline size-5 bg-white"></div>
                  <div className="text-4 text-white">chloe</div>
                  <div className="i-ic-round-keyboard-arrow-down size-5 bg-white"></div>
                </div>
              )
            : (
                <div>
                  <Button
                    className="text-white bg-transparent!"
                    onClick={login}
                  >
                    登录
                  </Button>
                </div>
              )
        }
      </Waiting>
    </>
  )
}
