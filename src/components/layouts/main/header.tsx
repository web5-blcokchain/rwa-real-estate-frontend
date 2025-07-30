import type { MenuProps } from 'antd'
import apiMyInfoApi from '@/api/apiMyInfoApi'
import logo from '@/assets/images/logo.png'
import { LoginDialog } from '@/components/dialog/login'
import { UserCode } from '@/enums/user'
import { useUserStore } from '@/stores/user'
import { ensureEthersNetwork } from '@/utils/ethers'
import { clearToken, getToken, setToken } from '@/utils/user'
import { usePrivy, useUser, useWallets } from '@privy-io/react-auth'
import { useMutation } from '@tanstack/react-query'
import { Link, useLocation, useNavigate } from '@tanstack/react-router'
import { Drawer, Dropdown } from 'antd'

export default function MainHeader() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const { connectWallet } = usePrivy()
  const { wallets } = useWallets()
  const { userData } = useUserStore()

  const showDrawer = () => {
    setOpen(true)
  }

  const onClose = () => {
    setOpen(false)
  }

  useEffect(() => {
    onClose()
  }, [pathname])

  useEffect(() => {
    if (wallets.length > 0 && wallets.some(wallet => wallet.walletClientType !== 'privy'))
      ensureEthersNetwork()
  }, [wallets])

  return (
    <header className="sticky left-0 top-0 z-10 z-99 fbc gap-3 bg-background px-107px py-6px text-text max-md:px-8px max-md:py-1">
      <div className="fyc gap-8">
        <div className="text-5 text-primary">
          <Link to="/home"><img src={logo} className="h-18 transform max-md:h-10 -translate-y-6%" /></Link>
        </div>
        <NavMenu className="fyc gap-8 lt-md:hidden" />
      </div>
      <div className="fyc gap-4 lt-lg:hidden">
        <RightMenu />
        {((!wallets.some(wallet => wallet.walletClientType !== 'privy')) && userData && Object.keys(userData).length > 0) && (
          <div
            onClick={() => {
              connectWallet()
              // if (wallets.length > 0) {
              //   connectWallet()
              // }
              // else {
              //   linkWallet()
              // }
            }}
            className="cursor-pointer"
          >
            {t('header.link_wallet')}
          </div>
        )}
      </div>

      <div className="hidden lt-lg:flex">
        <div className="i-material-symbols-menu-rounded size-10 max-md:h-6 max-md:w-6" onClick={showDrawer}></div>
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
          <div className="fyc gap-4">
            <RightMenu />
          </div>

          <NavMenu
            className={cn(
              'flex flex-col items-start justify-center gap-6 ',
              'text-base'
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
    { title: `${t('header.about')}`, href: '/about' },
    { title: `${t('footer.news')}`, href: '/news' }
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
  // const { open } = useGlobalDialogStore()
  const { userData } = useUserStore()
  const { refreshUser } = useUser()
  const { setCode, refreshUserInfo } = useUserStore()

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
    if (refreshUserInfo > 0) {
      mutateAsync()
    }
  }, [refreshUserInfo])

  function isTokenExpired(token: string) {
    if (!token)
      return true
    const payload = JSON.parse(atob(token.split('.')[1]))
    const now = Math.floor(Date.now() / 1000)
    return payload.exp < now
  }
  const { connectWallet } = usePrivy()
  const { wallets } = useWallets()

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
  const { logout } = usePrivy()
  const navigate = useNavigate()
  const { clearUserData } = useUserStore()
  async function handleLogout() {
    logout()
      .then(
        () => navigate({
          to: '/home'
        })
      )
      .then(() => {
        clearUserData()
        clearToken()
        setCode(UserCode.NotExist)
      })
  }
  const checkToken = async () => {
    try {
      const token = getToken()
      if (token && isTokenExpired(token)) {
        await refreshUser()
        getAccessToken().then((token) => {
          if (!token)
            return
          setToken(token, 2)
        })
      }
    }
    catch (error) {
      console.log(error)
      // 重新获取token失败，重新登录
      handleLogout()
    }
  }
  useEffect(() => {
    // 定时监测，刷新token (1分钟)
    const interval = setInterval(checkToken, 1000 * 60)
    const visibilitychange = () => {
      if (document.visibilityState === 'visible') {
        checkToken()
      }
    }
    // 从网页从后台切换至前台，监测token是否过期
    window.addEventListener('visibilitychange', visibilitychange)
    return () => {
      window.removeEventListener('visibilitychange', visibilitychange)
      clearInterval(interval)
    }
  }, [])

  return (
    <>
      <div className="flex flex-col justify-end gap-29px md:flex-row">
        <div className="fyc gap-29px">
          <LanguageSelect />

          {authenticated && (
            <div className="fyc gap-4">
              <div
                className="i-material-symbols-help-outline size-5 bg-white clickable"
                onClick={() => open('help')}
              >
              </div>
              {/* <div className="i-material-symbols-notifications-outline size-5 bg-white"></div> */}
              {/*
              <div
                className="i-material-symbols-favorite-outline-rounded size-5 bg-white clickable"
                onClick={
                  () => navigate({
                    to: '/account/collections'
                  })
                }
              >
              </div> */}
            </div>
          )}
          {/* <Link to="/news"><div className="w-max">{t('footer.news')}</div></Link> */}
        </div>
        <div className="fyc gap-4">
          <Waiting for={ready}>
            <div className="w-full fyc">
              {
                authenticated
                  ? (
                      <UserMenu />
                    )
                  : (
                      <div onClick={() => setOpenLoginDialog(true)} className="w-full fyc cursor-pointer space-x-4">
                        {/* <Button
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
                      </Button> */}
                        {t('header.login')}
                        /
                        {t('header.register')}
                      </div>
                    )
              }
            </div>
          </Waiting>
          {((!wallets.some(wallet => wallet.walletClientType !== 'privy')) && userData && Object.keys(userData).length > 0) && (
            <div
              onClick={() => {
                connectWallet()
                // if (wallets.length > 0) {
                //   connectWallet()
                // }
                // else {
                //   linkWallet()
                // }
              }}
              className="hidden w-fit cursor-pointer whitespace-nowrap text-4 lt-lg:block"
            >
              {t('header.link_wallet')}
            </div>
          )}
        </div>
      </div>
      <LoginDialog openState={[openLoginDialog, setOpenLoginDialog]} />
    </>
  )
}

const UserMenu: FC = () => {
  const navigate = useNavigate()
  const { logout } = usePrivy()
  const { t } = useTranslation()
  const { setCode, clearUserData, userData } = useUserStore()
  async function handleLogout() {
    logout()
      .then(
        () => navigate({
          to: '/home'
        })
      )
      .then(() => {
        clearUserData()
        clearToken()

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
      key: 'kyc_status',
      show: (userData.audit_status === null || userData.audit_status === undefined) ? 'hidden' : '',
      label: (
        <div onClick={() => {
          navigate({
            to: '/auditStatus'
          })
        }}
        >
          {t('header.kyc_status')}
        </div>
      )
    },
    {
      key: 'apply_for_kyc',
      label: (
        <div onClick={() => {
          navigate({
            to: '/account/create'
          })
        }}
        >
          {t('header.user_audit_status')}
        </div>

      ),
      show: (userData.audit_status === 1 || userData.audit_status > 2) ? 'hidden' : ''
    } as any,
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
  const visibleItems = items?.filter(item => (item as any)?.show !== 'hidden')
  // const connectWalletAddress = wallets.find(wallet => wallet.walletClientType !== 'privy')

  return (
    <Dropdown menu={{ items: visibleItems }} placement="bottomRight">
      <div className="fyc gap-1 clickable">
        <div className="i-material-symbols-account-circle-outline size-5 bg-white"></div>
        <div className="text-4 text-white" title={userData.email}>
          { `${(userData.email || '')?.slice(0, 4)}...${(userData.email || '')?.slice(-4)}` }
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
        <div className="w-max cursor-pointer text-4 text-white">
          {lang === 'zh' ? '中文' : lang === 'en' ? 'English' : '日本語'}
        </div>
        {/* <div className="i-ic-round-keyboard-arrow-down size-5 bg-white"></div> */}
      </div>
    </Dropdown>
  )
}
