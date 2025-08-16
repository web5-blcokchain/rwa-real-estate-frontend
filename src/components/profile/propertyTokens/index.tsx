import type { PropertyInvestment } from '@/api/apiMyInfoApi'
import apiMyInfo from '@/api/apiMyInfoApi'
import EmptyContent from '@/components/common/empty-content'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { Spin } from 'antd'
import DataCount from '../-components/data-count'
import PropertyTokenCard from '../-components/property-token-card'

function PropertyTokens() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [keyword, setKeyword] = useState('')
  const { t } = useTranslation()
  const [refetchCount, setRefetchCount] = useState(0)
  const [tokenData, setTokenData] = useState<PropertyInvestment[]>([])
  const pageSize = 20

  const getTokenData = async () => {
    const res = await apiMyInfo.getMeInfoSummary({ page, pageSize, keyword })
    if (page === 1)
      setTokenData(res.data?.list || [])
    else setTokenData([...tokenData, ...(res.data?.list || [] as any[])])
    return res
  }

  const { isLoading, isFetching } = useQuery({
    queryKey: ['overviewSummary', page, refetchCount],
    queryFn: async () => {
      const res = await getTokenData()
      setTotal(res.data?.count || 0)
      return res.data?.list || []
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

      <div className="py-8 text-white max-lg:py-4">
        <div className="flex items-center justify-between max-lg:flex-col max-lg:gap-3">
          <div className="text-8 text-[#fff] font-medium max-lg:mt-4 max-lg:text-6">
            {t('profile.propertyTokens.title')}
          </div>

          <div className="max-lg:w-full">
            <div className="fyc flex-inline b b-white rounded-xl b-solid p-4 max-lg:w-full space-x-4">
              <div className="i-iconamoon-search size-5 bg-[#b5b5b5]"></div>
              <input
                type="text"
                placeholder={t('common.search')}
                className="w-88 b-none bg-transparent outline-none"
                onChange={e => setKeyword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setPage(1)
                    setRefetchCount(refetchCount + 1)
                  }
                }}
                value={keyword}
              />
            </div>
          </div>
        </div>
        <div className={isFetching && page <= 1 ? 'py-20' : ''}>
          <Spin spinning={isFetching && page <= 1}>
            { tokenData && tokenData.length > 0
              ? (
                  <div className="grid grid-cols-1 mt-8 gap-8 max-lg:grid-cols-1 xl:grid-cols-2">
                    {
                      tokenData?.map((item: any) => (
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
                )
              : <EmptyContent />}
          </Spin>
        </div>
        {/* {!isFetching && tokenData && tokenData.length > 20 && (
          <div className="mt-8 text-center">
            <Button
              type="primary"
              size="large"
              className="rounded-full! text-black!"
              onClick={() => {
                setPage(page + 1)
                refetchPropertyTokens()
                }
              }

            >
              {t('common.load_more')}
            </Button>
          </div>
        )} */}
        {
          (total > page * pageSize) && (
            <div
              className="mt-4 fcc cursor-pointer text-center text-white"
              onClick={() => {
                setPage(page + 1)
              }}
            >
              <span>
                {' '}
                {t('common.load_more')}
              </span>
              {!isFetching ? <span>...</span> : <div className="i-line-md-loading-loop ml-2 bg-white"></div>}
            </div>
          )
        }
      </div>

    </div>
  )
}

export default PropertyTokens
