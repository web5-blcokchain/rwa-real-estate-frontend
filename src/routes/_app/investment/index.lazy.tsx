import { getInvestmentList } from '@/api/investment'
import { InvestmentTab } from '@/enums/investment'
import { useQuery } from '@tanstack/react-query'
import { createLazyFileRoute, useNavigate } from '@tanstack/react-router'
import { Button, Input, Select, Tabs } from 'antd'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { InvestmentCard } from './-components/card'

export const Route = createLazyFileRoute('/_app/investment/')({
  component: RouteComponent
})

function RouteComponent() {
  const [page, setPage] = useState(1)
  const [keyword, setKeyword] = useState('')
  const [type, setType] = useState(InvestmentTab.Sale)
  const [orderType, setOrderType] = useState('0')
  const { t } = useTranslation()
  const navigate = useNavigate()

  const orderTypeOptions = [
    { label: t('common.all'), value: '0' },
    { label: t('investment.hold'), value: '1' },
    { label: t('investment.not-held'), value: '2' }
  ]

  const { data, isLoading } = useQuery({
    queryKey: ['investment-list', page, keyword, type, orderType], // 添加 assetType 到查询键
    queryFn: async () => {
      const res = await getInvestmentList({
        page,
        keyword,
        type,
        order_type: orderType
      })
      return _get(res.data, 'list', [])
    }
  })

  const handleSearch = (value: string) => {
    setKeyword(value)
    setPage(1)
  }

  const handleAssetTypeChange = (value: string) => {
    setOrderType(value || '0') // 如果清除了选择，设为默认值 '0'
    setPage(1)
  }

  return (
    <div className="p-8">
      <div>
        <Tabs
          activeKey={type}
          onChange={(key) => {
            setType(key as InvestmentTab)
            setPage(1)
          }}
          className={cn(
            'mb-4 inline-flex',
            '[&_.ant-tabs-nav]:(mb-0!)',
            '[&_.ant-tabs-nav::before]:(b-none!)',
            '[&_.ant-tabs-tab-active]:(text-white!)',
            '[&_.ant-tabs-tab]:(text-[#898989]!)'
          )}
          items={[
            { label: t('investment.sale'), key: InvestmentTab.Sale },
            { label: t('investment.buy'), key: InvestmentTab.WantToBuy }
          ]}
        />
      </div>

      <div className={cn(
        'rounded-md bg-[#1e2024] p-6'
      )}
      >
        <div className="fbc">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-4 md:grid-cols-3 xl:grid-cols-5">
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
              value={keyword}
              onChange={e => handleSearch(e.target.value)}
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
              options={orderTypeOptions}
              allowClear
              value={orderType === '0' ? null : orderType}
              onChange={handleAssetTypeChange}
            />
          </div>

          <div className="flex-1">
            {
              type === InvestmentTab.WantToBuy && (
                <Button
                  type="primary"
                  size="large"
                  className="text-black!"
                  onClick={() => navigate({
                    to: '/transaction/create-buy-order'
                  })}
                >
                  {t('investment.button.create-buy-order')}
                </Button>
              )
            }

          </div>
        </div>
      </div>

      <Waiting
        for={!isLoading}
        className="h-32 fcc"
        iconClass="size-8"
      >
        {data && Array.isArray(data) && data.length > 0
          ? (
              <div
                className={cn(
                  'bg-[#1e2024] p-6',
                  '[&>div+div]:(b-t b-solid b-[#898989])'
                )}
              >
                {data.map((item: any) => (
                  <InvestmentCard
                    key={item.id}
                    item={item}
                    type={type}
                  />
                ))}
              </div>
            )
          : (
              <div className="h-32 w-full fcc bg-[#1e2024] p-6 text-[#898989]">
                {t('common.empty')}
              </div>
            )}
      </Waiting>

      {!isLoading && data?.list && data.list.length > 20 && (
        <div className="mt-8 text-center">
          <Button
            type="primary"
            size="large"
            className="rounded-full! text-black!"
            onClick={() => setPage(page + 1)}
          >
            {t('system.loadMore')}
          </Button>
        </div>
      )}
    </div>
  )
}
