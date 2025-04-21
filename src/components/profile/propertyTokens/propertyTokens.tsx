import type { listProps } from '@/api/apiMyInfoApi'
import apiMyInfo from '@/api/apiMyInfoApi'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { Button, Spin } from 'antd'
import CarPreview from '../-components/carPreview'
import DataCount from '../-components/dataCount'

function PropertyTokens() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [keyword, setKeyword] = useState('')

  const { data: tokenData, isLoading } = useQuery({
    queryKey: ['PropertyTokens', page, keyword],
    queryFn: async () => {
      const res = await apiMyInfo.getMeInfo({ page, pageSize: 20, keyword })
      return res.data?.list
    }
  })
  if (isLoading) {
    return (
      <div className="w-full p-8 h-dvh">
        <Spin />
      </div>
    )
  }

  return (
    <div>
      <DataCount />

      <div className="p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="text-8 text-[#fff] font-medium">
            Tokens Held
          </div>

          <div>
            <div className="fyc flex-inline b b-white rounded-xl b-solid p-4 space-x-4">
              <div className="i-iconamoon-search size-5 bg-[#b5b5b5]"></div>
              <input
                type="text"
                placeholder="Search"
                className="w-88 b-none bg-transparent outline-none"
                onChange={e => setKeyword(e.target.value)}
                value={keyword}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 mt-8 gap-8 xl:grid-cols-2">
          {
            tokenData?.map((item: listProps) => (
              <CarPreview
                key={item.id}
                picture={item.image_urls}
                title={item.name}
                location={item.location}
                size="813 sq ft"
                beds={item.bedrooms}
                price={item.current_price}
                tokenPrice={item.total_purchase}
                property_type={item.property_type}
                annual_return={item.expected_annual_return}
                number={item.number}
                onClick={() => {
                  navigate({ to: '/properties/detail/$id', params: { id: `${item.id}` } })
                }}
              />
            ))
          }
        </div>
        {!isLoading && tokenData?.list && tokenData.list.length > 20 && (
          <div className="mt-8 text-center">
            <Button
              type="primary"
              size="large"
              className="rounded-full! text-black!"
              onClick={() =>
                setPage(page + 1)}
            >
              Load More
            </Button>
          </div>
        )}
      </div>

    </div>
  )
}

export default PropertyTokens
