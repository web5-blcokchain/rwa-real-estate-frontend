import type { listProps } from '@/api/apiMyInfoApi'
import { _useStore as useStore } from '@/_store/_userStore'
import apiMyInfo from '@/api/apiMyInfoApi'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { Button, Spin } from 'antd'
import CarCount from '../-components/carCount'
import CarPreview from '../-components/carPreview'

function PropertyTokens() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [keyword, setKeyword] = useState('')
  const setAssetId = useStore((state: { setAssetId: (id: number) => void }) => state.setAssetId)

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
      <CarCount />

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

        <div className="grid grid-cols-1 mt-8 gap-8 md:grid-cols-3">
          {
            tokenData?.map((_: listProps, i: number) => (
              <CarPreview
                key={_.id}
                picture={_.image_urls || `https://picsum.photos/500/300?random=${i}`}
                title={_.address}
                location={_.location}
                size="813 sq ft"
                beds={_.bedrooms}
                price={_.current_price}
                tokenPrice={_.total_purchase}
                status={_.status}
                annual_return={_.expected_annual_return}
                number={_.number}
                onClick={() => {
                  setAssetId(_.id)
                  navigate({ to: '/properties/detail' })
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
