import apiBasic from '@/api/basicApi'
import { RealEstateCard } from '@/components/common/real-estate-card'
import { joinImagesPath } from '@/utils/url'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { createLazyFileRoute, useNavigate } from '@tanstack/react-router'
import { Button, Spin } from 'antd'
import { useState } from 'react'

export const Route = createLazyFileRoute('/_app/properties/')({
  component: RouteComponent
})

function RouteComponent() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [keyword, setKeyword] = useState('')
  const [page, setPage] = useState(1)

  async function searchDataList() {
    const res = await apiBasic.getDataList({ page, keyword })
    return res.data
  }

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['properties', page],
    queryFn: async () => {
      return searchDataList()
    }
    // enabled: false,
  })
  const [searchTime, setSearchTime] = useState(0)
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null)

  const queryClient = useQueryClient()
  const handleSearch = (value: string) => {
    setKeyword(value)
    setPage(1)
    // 防抖，2秒空闲后执行
    const clockTimer = 500
    if (Date.now() - searchTime > clockTimer) {
      if (timer) {
        clearTimeout(timer)
      }
      setTimer(setTimeout(() => {
        queryClient.cancelQueries({ queryKey: ['properties', page] })
        refetch()

        setSearchTime(Date.now())
      }, clockTimer))
    }
  }

  return (
    <div className="header-padding max-md:p-8">
      <div className="text-8 font-medium">
        {t('properties.title')}
      </div>

      <div className="mt-4 text-4 text-[#898989]">
        {t('properties.subTitle')}
      </div>

      <div className="mt-8">
        <div className="fyc flex-inline b b-white rounded-xl b-solid p-4 max-lg:w-full space-x-4">
          <div className="i-iconamoon-search size-5 bg-[#b5b5b5]"></div>
          <input
            type="text"
            placeholder={t('properties.search')}
            className="w-128 b-none bg-transparent outline-none"
            value={keyword}
            onChange={e => handleSearch(e.target.value)}
          />
        </div>
      </div>

      <Waiting
        for={!isLoading}
        className="h-32 fcc"
        iconClass="size-8"
      >
        <Spin spinning={!isLoading && isRefetching}>
          { data && data.list && data.list.length > 0
            ? (
                <div className="grid grid-cols-3 mt-8 gap-8 max-lg:grid-cols-2 max-md:grid-cols-1">
                  {data && Array.isArray(data.list) && data.list.map((item: Record<string, any>) => (
                    <RealEstateCard
                      key={item.id}
                      houseId={item.id}
                      collect={item.is_collect}
                      pictures={joinImagesPath(item.image_urls)}
                      title={item.name}
                      location={item.location}
                      area={item.area}
                      bedrooms={item.bedrooms}
                      house_life={item.house_life}
                      price={item.price}
                      tokenPrice={item.tokenPrice}
                      property_type={item.property_type}
                      expected_annual_return={item.expected_annual_return}
                      annual_return_max={item.annual_return_max}
                      annual_return_min={item.annual_return_min}
                      className="clickable-99"
                      onClick={() => {
                        navigate({ to: '/properties/detail/$id', params: { id: item.id } })
                      }}
                    />
                  ))}
                </div>
              )
            : (
                <div className="py-12 text-center text-4 text-[#898989]">
                  {t('common.empty')}
                </div>
              )}
        </Spin>
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
