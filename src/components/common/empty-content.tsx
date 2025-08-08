import { Empty } from 'antd'

export default function EmptyContent({ className }: { className?: string }) {
  const { t } = useTranslation()
  return (
    <div className={cn('h-200px fccc', className)}>
      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="">
        <div className="text-base text-white">{t('common.no_data')}</div>
      </Empty>
    </div>
  )
}
