import type { TokenHeldItem } from '@/types/profile'
import apiMyInfo from '@/api/apiMyInfoApi'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { Button, Spin } from 'antd'
import DataCount from '../-components/data-count'
import PropertyTokenCard from '../-components/property-token-card'

function PropertyTokens() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [keyword, setKeyword] = useState('')
  const { t } = useTranslation()

  const { data: tokenData, isLoading } = useQuery({
    queryKey: ['PropertyTokens', page, keyword],
    queryFn: async () => {
      const res = await apiMyInfo.getMeInfo({ page, pageSize: 20, keyword })
      return res.data?.list
    }
  })
  if (isLoading) {
    return (
      <div className="w-full fcc p-8 h-dvh">
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
            {t('profile.propertyTokens.title')}
          </div>

          <div>
            <div className="fyc flex-inline b b-white rounded-xl b-solid p-4 space-x-4">
              <div className="i-iconamoon-search size-5 bg-[#b5b5b5]"></div>
              <input
                type="text"
                placeholder={t('common.search')}
                className="w-88 b-none bg-transparent outline-none"
                onChange={e => setKeyword(e.target.value)}
                value={keyword}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 mt-8 gap-8 xl:grid-cols-2">
          {
            tokenData?.map((item: TokenHeldItem) => (
              <PropertyTokenCard
                key={item.id}
                {...item}
                onClick={() => {
                  navigate({
                    to: '/properties/detail/$id',
                    params: { id: `${item.properties_id}` }
                  })
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
              {t('common.load_more')}
            </Button>
          </div>
        )}
      </div>

    </div>
  )
}

export default PropertyTokens
