import { createLazyFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import 'swiper/css'
import 'swiper/css/free-mode'
import 'swiper/css/navigation'
import 'swiper/css/thumbs'

export const Route = createLazyFileRoute('/_app/properties/detail/')({
  component: RouteComponent
})

function RouteComponent() {
  const { t } = useTranslation()
  return (
    <div>{t('detail.title')}</div>
  )
}
