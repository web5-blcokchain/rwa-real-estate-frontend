import { useNavigate } from '@tanstack/react-router'
import { Button } from 'antd'
import { useTranslation } from 'react-i18next'

interface ErrorPageProps {
  message?: string
  description?: string
  showHomeButton?: boolean
}

export const ErrorPage: React.FC<ErrorPageProps> = ({
  message,
  description,
  showHomeButton = true
}) => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <div className="min-h-100vh fccc py-20 text-center">
      <div className="mb-6 text-7xl">🚧</div>
      <div className="mb-2 text-3xl font-bold">{message || t('common.error_title', '页面出错了')}</div>
      {description && <div className="mb-6 text-lg text-text-secondary">{description}</div>}
      {showHomeButton && (
        <Button type="primary" size="large" onClick={() => navigate({ to: '/home' })}>
          {t('common.back_home', '返回首页')}
        </Button>
      )}
    </div>
  )
}
