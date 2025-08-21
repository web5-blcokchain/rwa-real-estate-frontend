import { UserCode } from '@/enums/user'
import { useUserStore } from '@/stores/user'
import { getToken } from '@/utils/user'
import { usePrivy } from '@privy-io/react-auth'
import { useLocation, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

/**
 * 路由守卫Hook，用于全局路由拦截
 * 当用户不存在(isExist为false)时，除了白名单路径外，其他路径都会被重定向到/account/create
 */
export function useRouteGuard() {
  const navigate = useNavigate()
  const location = useLocation()
  const { code, userData } = useUserStore()
  const { t } = useTranslation()
  const prevPathRef = useRef<string | null>(null)
  const token = getToken()
  const { user } = usePrivy()

  useEffect(() => {
    // 白名单路径列表，支持字符串和正则
    const whiteList: (string | RegExp)[] = [
      '/',
      '/home',
      '/about',
      '/news',
      '/help',
      '/guidance',
      /^\/news\/detail\/\d+$/,
      '/properties',
      /^\/properties\/detail\/\d+$/,
      '/investment'
    ]

    const loggedInBlackList = [
      '/account/create'
    ]
    const currentPath = location.pathname

    // 如果用户已登录，且当前路径在黑名单中，则重定向到首页
    if (
      !(new Set([
        UserCode.NotExist,
        UserCode.NotAudited
      ]).has(code))
      && loggedInBlackList.includes(currentPath)
      && ![2, 5].includes(userData.audit_status)
    ) {
      navigate({
        to: '/'
      })
    }

    // 支持字符串和正则的白名单判断
    const isWhiteListed = whiteList.some(item =>
      typeof item === 'string'
        ? item === currentPath
        : item instanceof RegExp
          ? item.test(currentPath)
          : false
    )

    if (isWhiteListed) {
      // 跳转路由后，返回页面顶部
      setTimeout(() => {
        document.querySelector('.app-content')?.scrollTo(0, 0)
      }, 100)
      return
    }

    // TODO 判断当前用户是否审核通过
    // 1的时候表示已审核 2:中心化数据库审核拒绝 3.钱包绑定成功 4.kyc审核通过 5 kyc审核拒绝

    const hasLoginUrl = ['/profile', '/properties/payment', '/account/create', '/buy', '/sell', '/transaction/create-buy-order', '/transaction/create-sell-order']
    // console.log(currentPath, hasLoginUrl)

    if (hasLoginUrl.some(item => currentPath.includes(item))) {
      const email = user?.email || user?.google?.email
      if (userData.audit_status === 0) {
        toast.error(t('header.error.wallet_already_bound'))
        navigate({
          to: '/account/create'
        })
      }
      else if (code === UserCode.NotExist) {
        if (!((userData.id || email) && currentPath.includes('/account/create'))) {
          toast.error(t(!userData.id && !email ? 'header.error.login_required' : 'header.error.user_not_found'))
          navigate({
            to: !userData.id && !email ? '/home' : '/account/create'
          })
        }
      }
    }

    prevPathRef.current = location.pathname
    // 跳转路由后，返回页面顶部
    setTimeout(() => {
      document.querySelector('.app-content')?.scrollTo(0, 0)
    }, 100)
  }, [
    code,
    location.pathname, // 使用location.pathname替换router.latestLocation.pathname
    navigate,
    t,
    token
  ])
}
