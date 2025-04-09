import apiBasic from '@/api/basicApi'
import { RealEstateCard } from '@/components/common/real-estate-card'
import { useQuery } from '@tanstack/react-query'
import { createLazyFileRoute, useNavigate } from '@tanstack/react-router'
import { Button } from 'antd'
import { useState } from 'react'

export const Route = createLazyFileRoute('/_app/properties/')({
  component: RouteComponent
})

const baseUrl = import.meta.env.VITE_PUBLIC_API_URL

function RouteComponent() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [keyword, setKeyword] = useState('')
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['properties', page, keyword],
    queryFn: async () => {
      const res = await apiBasic.getDataList({ page, keyword })
      return res.data
    }
  })

  const handleSearch = (value: string) => {
    setKeyword(value)
    setPage(1)
  }

  return (
    <div className="p-8">
      <div className="text-8 font-medium">
        {t('properties.title')}
      </div>

      <div className="mt-4 text-4 text-[#898989]">
        {t('properties.subTitle')}
      </div>

      <div className="mt-8">
        <div className="fyc flex-inline b b-white rounded-xl b-solid p-4 space-x-4">
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
        for={!isLoading && data && !!data?.list}
        className="h-32 fcc"
        iconClass="size-8"
      >
        <div className="grid grid-cols-1 mt-8 cursor-pointer gap-8 md:grid-cols-3">
          {data?.list.map((item: Record<string, any>) => (
            <RealEstateCard
              key={item.id}
              houseId={item.id}
              collect={item.is_collect}
              picture={`${baseUrl}${item.image_urls}`}
              title={item.name}
              location={item.location}
              area={item.area}
              bedrooms={item.bedrooms}
              house_life={item.house_life}
              price={item.price}
              tokenPrice={item.tokenPrice}
              status={item.status}
              onClick={() => {
                navigate({ to: '/properties/detail/$id', params: { id: item.id } })
              }}
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
            {t('system.loadMore')}
          </Button>
        </div>
      )}
    </div>
  )
}
