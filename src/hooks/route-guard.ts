import { UserCode } from '@/enums/user'
import { useUserStore } from '@/stores/user'
import { getToken } from '@/utils/user'
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
  const { code } = useUserStore()
  const { t } = useTranslation()

  const token = getToken()

  useEffect(() => {
    // 白名单路径列表，支持字符串和正则
    const whiteList: (string | RegExp)[] = [
      '/',
      '/home',
      '/about',
      '/news',
      '/help',
      /^\/news\/detail\/\d+$/,
      '/account/create',
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

    if (!token) {
      navigate({
        to: '/home'
      })
      toast.error(t('header.error.login_required'))
      return
    }

    if (code === UserCode.NotExist) {
      toast.error(t('header.error.user_not_found'))
      navigate({
        to: '/account/create'
      })
    }
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
