import { getInvestmentList } from '@/api/investment'
import { useQuery } from '@tanstack/react-query'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Button, Input, Select } from 'antd'
import { useState } from 'react'
import { InvestmentCard } from './-components/card'

export const Route = createLazyFileRoute('/_app/investment/')({
  component: RouteComponent
})

function RouteComponent() {
  const [page, setPage] = useState(1)
  const [keyword, setKeyword] = useState('')

  const assetTypeOptions = [
    { label: 'All', value: 'all' },
    { label: 'Apartment', value: 'apartment' },
    { label: 'House', value: 'house' },
    { label: 'Land', value: 'land' },
    { label: 'Commercial', value: 'commercial' }
  ]

  const { data, isLoading } = useQuery({
    queryKey: ['investment-list', page, keyword],
    queryFn: async () => {
      const res = await getInvestmentList({ page, keyword })
      return _get(res.data, 'list', [])
    }
  })

  const handleSearch = (value: string) => {
    setKeyword(value)
    setPage(1)
  }

  return (
    <div className="p-8 space-y-8">
      <div className={cn(
        'rounded-md bg-[#1e2024] p-6',
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
          options={assetTypeOptions}
          allowClear
        />
      </div>

      <Waiting
        for={!isLoading}
        className="h-32 fcc"
        iconClass="size-8"
      >
        <div
          className={cn(
            'bg-[#1e2024] p-6',
            '[&>div+div]:(b-t b-solid b-[#898989])'
          )}
        >
          {data && Array.isArray(data) && data.map((item: any) => (
            <InvestmentCard
              key={item.id}
              item={item}
            />
          ))}
        </div>
      </Waiting>

      {!isLoading && data?.list && data.list.length > 20 && (
        <div className="mt-8 text-center">
          <Button
            type="primary"
            size="large"
            className="rounded-full! text-black!"
            onClick={() => setPage(page + 1)}
          >
            Load More
          </Button>
        </div>
      )}
    </div>
  )
}
