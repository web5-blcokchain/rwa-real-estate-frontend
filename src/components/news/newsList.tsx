import { getNews, getNewsType } from '@/api/news'
import { useQuery } from '@tanstack/react-query'
import { ConfigProvider, Pagination, Spin, Tabs } from 'antd'
import EmptyContent from '../common/empty-content'
import Document from '../profile/document'

export function NewsList({ hasPagination = true, newsClos = 3, className }: {
  hasPagination?: boolean
  newsClos?: number
  className?: string
}) {
  const { i18n } = useTranslation()
  const [tabsKey, setTabsKey] = useState(0)
  const [activeKey, setActiveKey] = useState<string>()
  const { data: newsType, isLoading: newsTypeLoading } = useQuery({
    queryKey: ['getNewsType'],
    retry: 3,
    queryFn: async () => {
      const data = await getNewsType()
      if (data.data?.list && data.data?.list.length > 0)
        setActiveKey('0')
      return data.data
    }
  })
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 12,
    total: 0
  })
  async function getNewsList() {
    const newsTypeId = newsType?.list[Number(activeKey)].id
    const data = await getNews({ type_id: newsTypeId!, page: pagination.current, pageSize: pagination.pageSize })
    setPagination({
      ...pagination,
      total: data.data?.total || 0
    })
    return data
  }
  const { data: news, isFetching: newsLoading, refetch } = useQuery({
    queryKey: ['getNews', activeKey],
    retry: 3,
    queryFn: async () => {
      const data = await getNewsList()
      return data.data
    },
    enabled: !!activeKey
  })
  useEffect(() => {
    if (activeKey)
      refetch()
  }, [pagination.current, pagination.pageSize, newsType])

  function getLabelOfI18n(index: number) {
    const lang = i18n.language
    const data = newsType?.list[index]
    switch (lang) {
      case 'zh':
        return data?.title_zh
      case 'jp':
        return data?.title_jp
      case 'en':
        return data?.title_en
    }
    return ''
  }

  const tabOfDocument = () => {
    return (
      <Spin spinning={newsLoading}>
        {news?.list && news.list.length > 0
          ? (
              <div style={{ gridTemplateColumns: `repeat(${newsClos}, minmax(0, 1fr))` }} className="grid gap-x-[29px] gap-y-[43px] rounded-14px max-lg:grid-cols-2 max-lg:gap-3 max-xl:gap-6">
                {
                  news?.list && news.list?.map((res) => {
                    return <Document key={res.title_en} data={res} />
                  })
                }
              </div>
            )
          : <EmptyContent />}
      </Spin>
    )
  }

  useEffect(() => {
    // 语言变化后触发 Tabs 的宽度重计算
    setTabsKey(prev => prev + 1)
  }, [i18n.language])

  return (
    <div className={cn('header-padding news-tables', className)}>
      <Waiting for={!newsTypeLoading} className={newsTypeLoading ? 'h-100vh fcc' : ''}>
        <ConfigProvider
          theme={{
            // 1. 单独使用暗色算法
            components: {
              Tabs: {

              }
            }
          }}
        >
          <Tabs
            activeKey={activeKey}
            key={tabsKey}
            onChange={setActiveKey}
            className="mt-8 max-lg:mt-0px"
            defaultActiveKey=""
            items={newsType?.list.map((_res, index) => {
              return { label: getLabelOfI18n(index), key: index.toString(), children: tabOfDocument() }
            }) || []}
          />
        </ConfigProvider>
        {news?.list && news.list.length > 0 && hasPagination && (
          <div className="fcc py-10">
            <Pagination
              showQuickJumper={false}
              showSizeChanger={false}
              current={pagination.current}
              pageSize={pagination.pageSize}
              total={pagination.total}
              onChange={(page, pageSize) => {
                setPagination({
                  ...pagination,
                  current: page,
                  pageSize
                })
              }}
            />
          </div>
        )}
      </Waiting>
    </div>
  )
}
