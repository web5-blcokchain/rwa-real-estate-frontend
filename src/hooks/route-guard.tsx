import { UserCode } from '@/enums/user'
import { useMessageDialogStore } from '@/stores/message-dialog'
import { useUserStore } from '@/stores/user'
import { getToken } from '@/utils/user'
import { useLocation, useNavigate } from '@tanstack/react-router'
import { Button } from 'antd'
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
  const { open: openMessageDialog, close } = useMessageDialogStore()
  const token = getToken()

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
      && userData.audit_status !== 2
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

    const hasLoginUrl = ['/profile', '/properties/payment']
    // console.log(currentPath, hasLoginUrl)
    const dialog_audit_status = JSON.parse(localStorage.getItem('audit_status') || 'false')
    if (hasLoginUrl.some(item => currentPath.includes(item))) {
      if (userData.audit_status === 0) {
        toast.error(t('header.error.wallet_already_bound'))
        navigate({
          to: '/account/create'
        })
      }
      else if ([2, 5].includes(userData.audit_status) && !dialog_audit_status) {
        localStorage.setItem('audit_status', JSON.stringify(true))
        // window.history.back()
        setTimeout(() => {
          openMessageDialog((
            <div className="fccc gap-2">
              <div className="i-carbon:close-outline size-16 bg-#ec5b56"></div>
              <div className="text-center text-8 font-bold max-lg:text-6">{t('header.error.centralized_database_review_rejection')}</div>
              <div className="text-4 text-#5e6570">{t('header.error.kyc_audit_rejected_desc')}</div>
              <Button
                type="primary"
                onClick={() => {
                  navigate({
                    to: '/account/create'
                  })
                  setTimeout(() => {
                    close()
                  }, 200)
                }}
              >
                {t('common.reupload')}
              </Button>

            </div>
          ), t('header.error.centralized_database_review_rejection')
          )
        }, 200)

        // 返回上一级页面
      }
    }
    if (code === UserCode.NotExist) {
      toast.error(t('header.error.user_not_found'))
      navigate({
        to: '/account/create'
      })
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
