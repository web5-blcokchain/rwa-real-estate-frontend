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
  const { isExist } = useUserStore()
  const { t } = useTranslation()

  const token = getToken()

  useEffect(() => {
    // 白名单路径列表
    const whiteList = [
      '/',
      '/home',
      '/about',
      '/account/create',
      '/properties'
    ]

    const loggedInBlackList = [
      '/account/create'
    ]

    const currentPath = location.pathname

    // 如果用户已登录，且当前路径在黑名单中，则重定向到首页
    if (
      isExist
      && loggedInBlackList.includes(currentPath)) {
      navigate({
        to: '/'
      })
    }

    const isWhiteListed = whiteList.includes(currentPath)

    if (isWhiteListed) {
      return
    }

    if (!token) {
      navigate({
        to: '/home'
      })
      toast.error(t('header.error.login_required'))
      return
    }

    if (!isExist) {
      toast.error(t('header.error.user_not_found'))
      navigate({
        to: '/account/create'
      })
    }
  }, [
    isExist,
    location.pathname, // 使用location.pathname替换router.latestLocation.pathname
    navigate,
    t,
    token
  ])
}
