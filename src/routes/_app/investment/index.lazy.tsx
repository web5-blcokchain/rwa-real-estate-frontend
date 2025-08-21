import { getAssetType } from '@/api/apiMyInfoApi'
import { getInvestmentList } from '@/api/investment'
import { InvestmentTab } from '@/enums/investment'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { createLazyFileRoute, useNavigate } from '@tanstack/react-router'
import { Button, Input, Select, Spin, Tabs } from 'antd'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { InvestmentCard } from './-components/card'

export const Route = createLazyFileRoute('/_app/investment/')({
  component: RouteComponent
})

function RouteComponent() {
  const [page, setPage] = useState(1)
  const [keyword, setKeyword] = useState('')
  const [orderType, setOrder_Type] = useState(InvestmentTab.Sale)
  const [type, setType] = useState('0')
  const { t } = useTranslation()
  const navigate = useNavigate()

  const typeOptions = [
    { label: t('common.all'), value: '0' },
    { label: t('investment.num_descending'), value: '1' },
    { label: t('investment.num_ascending'), value: '2' }
  ]
  const [propertyTypeList, setPropertyTypeList] = useState([
    { label: <div>{t('dividendStatistics.all')}</div>, value: 0 }
  ])
  const [propertyType, setPropertyType] = useState()
  const [sortType, setSortType] = useState(0)
  const { data: assetType } = useQuery({
    queryKey: ['assetType'],
    queryFn: async () => {
      const data = await getAssetType()
      return data.data
    }
  })
  useEffect(() => {
    setPropertyTypeList([
      { label: <div>{t('dividendStatistics.all')}</div>, value: 0 },
      ...assetType?.map(item => ({ label: <div>{item.name}</div>, value: item.id })) || []
    ])
  }, [assetType])

  const toGetInvestmentList = async () => {
    return await getInvestmentList({
      page,
      keyword,
      pageSize: 12,
      order_type: orderType,
      property_type: propertyType === 0 ? undefined : propertyType,
      price_sort: sortType === 0 ? undefined : sortType,
      number_sort: type === '0' ? undefined : type
    })
  }

  const { data, isFetching: isLoading, refetch } = useQuery({
    queryKey: ['investment-list', page, orderType, type, propertyType, sortType], // 添加 assetType 到查询键
    queryFn: async () => {
      const res = await toGetInvestmentList()
      return res.data
    }
  })
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null)
  const [searchTime, setSearchTime] = useState(0)
  const queryClient = useQueryClient()
  const handleSearch = (value: string) => {
    setKeyword(value)
    setPage(1)
    // 防抖，2秒空闲后执行
    const clockTimer = 1500
    if (Date.now() - searchTime > clockTimer) {
      if (timer) {
        clearTimeout(timer)
      }
      setTimer(setTimeout(() => {
        // 取消之前的请求
        queryClient.cancelQueries({ queryKey: ['investment-list', page, orderType, type, propertyType, sortType] })
        refetch()

        setSearchTime(Date.now())
      }, clockTimer))
    }
  }

  const handleAssetTypeChange = (value: string) => {
    setType(value || '0') // 如果清除了选择，设为默认值 '0'
    setPage(1)
  }

  return (
    <div className="header-padding py-8 max-lg:py-4">
      <div>
        <Tabs
          activeKey={orderType}
          onChange={(key) => {
            setOrder_Type(key as InvestmentTab)
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
        <div className="fbc gap-6 max-lg:flex-col">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-4 md:grid-cols-3 xl:grid-cols-5 max-lg:w-full">
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
              value={keyword}
              onChange={e => handleSearch(e.target.value)}
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
              options={typeOptions}
              allowClear
              value={type === '0' ? null : type}
              onChange={handleAssetTypeChange}
            />
            <Select
              placeholder={t('properties.assetType')}
              size="large"
              className={cn(
                '[&_.ant-select-selector]:(bg-transparent! text-white!)',
                '[&_.ant-select-selection-placeholder]:(text-[#898989]!)',
                '[&_.ant-select-selection-item]:(bg-transparent! text-white!)',
                '[&_.ant-select-arrow]:(text-white!)'
              )}
              options={propertyTypeList}
              value={propertyType}
              onChange={setPropertyType}
            />
            <div onClick={() => setSortType(sortType === 1 ? 0 : 1)} className={cn('fcc px-2 h-10 b-1 rounded-md cursor-pointer', sortType === 1 ? 'b-#e8d655 text-white' : 'b-#424242 text-#898989 ')}>
              <div className="i-ph:sort-descending bg-#898989"></div>
              <div className="truncate" title={t('investment.descending')}>{t('investment.descending')}</div>
            </div>
            <div onClick={() => setSortType(sortType === 2 ? 0 : 2)} className={cn('fcc px-2 h-10 b-1 rounded-md cursor-pointer', sortType === 2 ? 'b-#e8d655 text-white' : 'b-#424242 text-#898989 ')}>
              <div className="i-ph:sort-ascending bg-#898989"></div>
              <div className="truncate" title={t('investment.ascending')}>{t('investment.ascending')}</div>
            </div>
          </div>

          <div className="flex-1 max-lg:w-full">
            {
              orderType === InvestmentTab.WantToBuy && (
                <Button
                  type="primary"
                  size="large"
                  className="max-lg:w-full text-black!"
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

      <Spin
        spinning={isLoading}
        className="h-32 fcc"
      >
        {data && Array.isArray(data.list) && data.list.length > 0
          ? (
              <div
                className={cn(
                  'bg-[#1e2024] p-6 pt-0',
                  '[&>div+div]:(b-t b-solid b-[#898989])'
                )}
              >
                {data?.list?.map((item: any) => (
                  <InvestmentCard
                    key={item.id}
                    item={item}
                    type={orderType}
                  />
                ))}
              </div>
            )
          : (
              <div className="h-32 w-full fcc bg-[#1e2024] p-6 text-[#898989]">
                {t('common.empty')}
              </div>
            )}
      </Spin>

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
