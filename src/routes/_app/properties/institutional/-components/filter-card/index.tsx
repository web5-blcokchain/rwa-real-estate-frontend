import { Input, Select } from 'antd'

export const FilterCard: FC = () => {
  const assetTypeOptions = [
    { label: 'All', value: 'all' },
    { label: 'Apartment', value: 'apartment' },
    { label: 'House', value: 'house' },
    { label: 'Land', value: 'land' },
    { label: 'Commercial', value: 'commercial' }
  ]

  const investmentScaleOptions = [
    { label: 'All', value: 'all' },
    { label: 'Small', value: 'small' },
    { label: 'Medium', value: 'medium' },
    { label: 'Large', value: 'large' }
  ]

  const riskLevelOptions = [
    { label: 'All', value: 'all' },
    { label: 'Low', value: 'low' },
    { label: 'Medium', value: 'medium' },
    { label: 'High', value: 'high' }
  ]

  return (
    <div className={cn(
      'rounded bg-[#1e2024] p-6',
      'grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
    )}
    >
      <Input
        size="large"
        placeholder="Search address, type"
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
        placeholder="Asset Type"
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
