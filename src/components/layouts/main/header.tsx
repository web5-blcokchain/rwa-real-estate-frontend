import type { MenuProps } from 'antd'
import apiMyInfoApi from '@/api/apiMyInfoApi'
import logo from '@/assets/images/logo.png'
import { LoginDialog } from '@/components/dialog/login'
import { UserCode } from '@/enums/user'
import { useGlobalDialogStore } from '@/stores/chat-help-dialog'
import { useUserStore } from '@/stores/user'
import { clearToken, setToken } from '@/utils/user'
import { shortAddress } from '@/utils/wallet'
import { usePrivy } from '@privy-io/react-auth'
import { useMutation } from '@tanstack/react-query'
import { Link, useLocation, useNavigate } from '@tanstack/react-router'
import { Button, Drawer, Dropdown } from 'antd'

export default function MainHeader() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  const showDrawer = () => {
    setOpen(true)
  }

  const onClose = () => {
    setOpen(false)
  }

  useEffect(() => {
    onClose()
  }, [pathname])

  return (
    <header className="sticky left-0 top-0 z-10 h-32 fbc bg-background px-8 text-text">
      <div className="fyc gap-8">
        <div className="text-5 text-primary">
          <img src={logo} className="h-12" />
        </div>
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
  const { t } = useTranslation()

  const links = [
    { title: `${t('header.home')}`, href: '/home' },
    { title: `${t('header.properties')}`, href: '/properties' },
    { title: `${t('header.investment')}`, href: '/investment' },
    { title: `${t('header.about')}`, href: '/about' }
  ]

  return (
    <nav className={cn(
      'text-4',
      className
    )}
    >
      {
        links.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'cursor-pointer active:text-primary hover:text-primary',
              pathname.startsWith(link.href) ? 'text-text' : 'text-[#8d909a]'
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
  const { t } = useTranslation()
  const [, setUserObj] = useState<Record<string, any>>()
  const setUserData = useUserStore(state => state.setUserData)
  const { open } = useGlobalDialogStore()
  const navigate = useNavigate()
  const { setCode } = useUserStore()

  const [openLoginDialog, setOpenLoginDialog] = useState(false)

  const { ready, authenticated, user, getAccessToken } = usePrivy()

  const { mutateAsync } = useMutation({
    mutationKey: ['getUserInfo'],
    mutationFn: async () => {
      const res = await apiMyInfoApi.getUserInfo()

      const code = _get(res, 'code')

      setCode(code)

      const data = _get(res, 'data', {})
      setUserData(data)
      setUserObj(data)

      return data
    }
  })

  useEffect(() => {
    if (!authenticated)
      return

    Promise.all([
      mutateAsync(),
      getAccessToken().then((token) => {
        if (!token)
          return

        setToken(token, 2)
      })
    ])
      .then(() => {
        if (openLoginDialog) {
          setOpenLoginDialog(false)
        }
      })
  }, [authenticated, user, mutateAsync])

  return (
    <>
      <div className="flex flex-col items-center justify-end gap-4 md:flex-row">
        <div className="fyc gap-4">
          <LanguageSelect />

          <div className="fyc gap-4">
            <div
              className="i-material-symbols-help-outline size-5 bg-white clickable"
              onClick={() => open('help')}
            >
            </div>
            <div className="i-material-symbols-notifications-outline size-5 bg-white"></div>
            <div
              className="i-material-symbols-favorite-outline-rounded size-5 bg-white clickable"
              onClick={
                () => navigate({
                  to: '/account/collections'
                })
              }
            >
            </div>
          </div>
        </div>

        <Waiting for={ready}>
          <div className="w-full fec">
            {
              authenticated
                ? (
                    <UserMenu />
                  )
                : (
                    <div className="w-full fec space-x-4">
                      <Button
                        className="text-white bg-transparent!"
                        onClick={() => setOpenLoginDialog(true)}
                      >
                        {t('header.login')}
                      </Button>
                      <Button
                        className="text-white bg-transparent!"
                        onClick={() => navigate({
                          to: '/account/create'
                        })}
                      >
                        {t('header.register')}
                      </Button>
                    </div>
                  )
            }
          </div>
        </Waiting>
      </div>

      <LoginDialog openState={[openLoginDialog, setOpenLoginDialog]} />
    </>
  )
}

const UserMenu: FC = () => {
  const navigate = useNavigate()
  const { logout, linkWallet } = usePrivy()
  const { t } = useTranslation()
  const { userData, setCode, setUserData } = useUserStore()

  async function handleLogout() {
    logout()
      .then(
        () => navigate({
          to: '/home'
        })
      )
      .then(() => {
        clearToken()
        setUserData({})
        setCode(UserCode.NotExist)
      })
  }

  const items: MenuProps['items'] = [
    {
      key: 'profile',
      label: (
        <div onClick={() => {
          navigate({
            to: '/profile'
          })
        }}
        >
          {t('header.profile')}
        </div>
      )
    },
    {
      key: 'link_wallet',
      label: (
        <div onClick={linkWallet}>
          {t('header.link_wallet')}
        </div>
      )
    },
    {
      key: 'logout',
      label: (
        <div
          className="text-red"
          onClick={handleLogout}
        >
          {i18n.t('header.logout')}
        </div>
      )
    }
  ]

  return (
    <Dropdown menu={{ items }} placement="bottomRight">
      <div className="fyc gap-1 clickable">
        <div className="i-material-symbols-account-circle-outline size-5 bg-white"></div>
        <div className="text-4 text-white">
          {shortAddress(_get(userData, 'wallet_address', ''))}
        </div>
        <div className="i-ic-round-keyboard-arrow-down size-5 bg-white"></div>
      </div>
    </Dropdown>
  )
}

function LanguageSelect() {
  const lang = useUserStore(state => state.language)
  const setLang = useUserStore(state => state.setLanguage)

  useEffect(() => {
    const handleLanguageChange = () => {
      setLang(i18n.language)
    }

    // 监听语言变化事件
    i18n.on('languageChanged', handleLanguageChange)

    // 清理事件监听
    return () => {
      i18n.off('languageChanged', handleLanguageChange)
    }
  }, [setLang])

  const items: MenuProps['items'] = [
    {
      label: (
        <div
          onClick={() => {
            setLang('zh')
            i18n.changeLanguage('zh')
          }}
        >
          中文
        </div>
      ),
      key: 'zh'
    },
    {
      label: (
        <div
          onClick={() => {
            setLang('en')
            i18n.changeLanguage('en')
          }}
        >
          English
        </div>
      ),
      key: 'en'
    },
    {
      label: (
        <div
          onClick={() => {
            setLang('jp')
            i18n.changeLanguage('jp')
          }}
        >
          日本語
        </div>
      ),
      key: 'jp'
    }
  ]

  return (
    <Dropdown menu={{ items }} placement="bottomRight">
      <div className="fyc gap-1">
        <div className="i-majesticons-globe-line size-5 bg-white"></div>
        <div className="w-[50px] cursor-pointer text-4 text-white">
          {lang === 'zh' ? '中文' : lang === 'en' ? 'English' : '日本語'}
        </div>
        <div className="i-ic-round-keyboard-arrow-down size-5 bg-white"></div>
      </div>
    </Dropdown>
  )
}
