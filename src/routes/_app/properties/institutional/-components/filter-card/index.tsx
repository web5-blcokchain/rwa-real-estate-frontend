import { Input, Select } from 'antd'

export const FilterCard: FC = () => {
  const { t } = useTranslation()
  const assetTypeOptions = [
    { label: <div>{t('profile.transaction_status.all')}</div>, value: 'all' },
    { label: <div>{t('profile.transaction_status.apartment')}</div>, value: 'apartment' },
    { label: <div>{t('profile.transaction_status.house')}</div>, value: 'house' },
    { label: <div>{t('profile.transaction_status.land')}</div>, value: 'land' },
    { label: <div>{t('profile.transaction_status.commercial')}</div>, value: 'commercial' }
  ]

  const investmentScaleOptions = [
    { label: <div>{t('profile.transaction_status.all')}</div>, value: 'all' },
    { label: <div>{t('profile.transaction_status.small')}</div>, value: 'small' },
    { label: <div>{t('profile.transaction_status.medium')}</div>, value: 'medium' },
    { label: <div>{t('profile.transaction_status.large')}</div>, value: 'large' }
  ]

  const riskLevelOptions = [
    { label: <div>{t('profile.transaction_status.all')}</div>, value: 'all' },
    { label: <div>{t('profile.transaction_status.low')}</div>, value: 'low' },
    { label: <div>{t('profile.transaction_status.medium')}</div>, value: 'medium' },
    { label: <div>{t('profile.transaction_status.high')}</div>, value: 'high' }
  ]

  return (
    <div className={cn(
      'rounded bg-[#1e2024] p-6',
      'grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
    )}
    >
      <Input
        size="large"
        placeholder={t('common.search_placeholder')}
        className={cn(
          'bg-transparent! text-white!',
          '[&>input]:(placeholder-text-[#898989])'
        )}
        prefix={(
          <div
            className="i-iconamoon-search mx-1 size-4 bg-[#b5b5b5]"
          />
        )}
      />

      <Select
        size="large"
        placeholder={t('common.asset_type')}
        className={cn(
          '[&_.ant-select-selector]:(bg-transparent! text-white!)',
          '[&_.ant-select-selection-placeholder]:(text-[#898989]!)',
          '[&_.ant-select-selection-item]:(bg-transparent! text-white!)',
          '[&_.ant-select-arrow]:(text-white!)'
        )}
        options={assetTypeOptions}
        allowClear
      />

      <Select
        size="large"
        placeholder="Investment Scale"
        className={cn(
          '[&_.ant-select-selector]:(bg-transparent! text-white!)',
          '[&_.ant-select-selection-placeholder]:(text-[#898989]!)',
          '[&_.ant-select-selection-item]:(bg-transparent! text-white!)',
          '[&_.ant-select-arrow]:(text-white!)'
        )}
        options={investmentScaleOptions}
        allowClear
      />

      <Select
        size="large"
        placeholder="Investment Scale"
        className={cn(
          '[&_.ant-select-selector]:(bg-transparent! text-white!)',
          '[&_.ant-select-selection-placeholder]:(text-[#898989]!)',
          '[&_.ant-select-selection-item]:(bg-transparent! text-white!)',
          '[&_.ant-select-arrow]:(text-white!)'
        )}
        options={riskLevelOptions}
        allowClear
      />
    </div>
  )
}
