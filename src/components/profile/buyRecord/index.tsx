import type { OrderTransaction } from '@/api/transaction'
import type { TableProps } from 'antd'
import { getAssetType } from '@/api/apiMyInfoApi'
import { marketTransactionHistory } from '@/api/transaction'
import group272Icon from '@/assets/icons/group272.png'
import { formatNumberNoRound } from '@/utils/number'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { ConfigProvider, Empty, Input, Select, Table } from 'antd'
import enUS from 'antd/locale/en_US'
import jaJP from 'antd/locale/ja_JP'
import zhCN from 'antd/locale/zh_CN'
import dayjs from 'dayjs'
import { envConfig } from '../../../utils/envConfig'

export function BuyRecord() { // 市场交易购买记录
  const { t, i18n } = useTranslation()
  const [keyword, setKeyword] = useState('')
  const [propertyType, setPropertyType] = useState()
  const locale = useMemo(() => i18n.language === 'en' ? enUS : i18n.language === 'zh' ? zhCN : jaJP, [i18n])
  const [selectOrderType, setSelectOrderType] = useState<number>()
  const [pagination, setPagination] = useState({
    pageSize: 10,
    current: 1,
    total: 0,
    showQuickJumper: true,
    showSizeChanger: false
  })
  const searchDataList = async () => {
    const res = await marketTransactionHistory({
      page: pagination.current,
      address: keyword,
      type: !selectOrderType ? undefined : selectOrderType,
      pageSize: pagination.pageSize,
      property_type: propertyType === 0 ? undefined : propertyType
    })
    pagination.total = res.data?.count || 0
    return res
  }
  const { data, isFetching: isLoading, refetch } = useQuery({
    queryKey: ['investment-list-buy', pagination.current, propertyType, selectOrderType], // 添加 assetType 到查询键
    queryFn: async () => {
      const res = await searchDataList()
      return res.data
    }
  })
  // const { wallets } = useWallets()
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null)
  const [searchTime, setSearchTime] = useState(0)
  const queryClient = useQueryClient()
  // 搜索
  const handleSearch = (value: string) => {
    setKeyword(value)
    setPagination({
      ...pagination,
      current: 1
    })
    // 防抖，2秒空闲后执行
    const clockTimer = 1500
    if (Date.now() - searchTime > clockTimer) {
      if (timer) {
        clearTimeout(timer)
      }
      setTimer(setTimeout(() => {
        // 取消之前的请求
        queryClient.cancelQueries({ queryKey: ['investment-list-sale', pagination.current, propertyType] })
        refetch()

        setSearchTime(Date.now())
      }, clockTimer))
    }
  }

  const [propertyTypeList, setPropertyTypeList] = useState([
    { label: <div>{t('dividendStatistics.all')}</div>, value: 0 }
  ])
  const orderTypeList = [
    { label: <div>{t('dividendStatistics.all')}</div>, value: 0 },
    { label: <div>{t('dividendStatistics.buy')}</div>, value: 4 },
    { label: <div>{t('dividendStatistics.sell')}</div>, value: 3 }
  ]
  // 获取房屋类型
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

  const tableColumns: TableProps<OrderTransaction>['columns'] = [
    {
      title: <div>{t('id')}</div>,
      dataIndex: 'order_market_id',
      key: 'order_market_id'
    },
    {
      title: <div>{t('header.properties')}</div>,
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => {
        return (
          <div className="flex items-center justify-start">
            <img src={group272Icon} alt="" className="mr-2 h-6 w-6" />
            <div className="flex flex-col justify-start">
              <Link to="/properties/detail/$id" params={{ id: record.properties_id.toString() }}>
                <div>{record.name}</div>
              </Link>

            </div>
          </div>
        )
      }
    },
    {
      title: <div>{t('profile.common.type')}</div>,
      dataIndex: 'order_type',
      key: 'order_type',
      render: (_, record) => {
        return (
          <div>
            {t(`dividendStatistics.${record.type === 4 ? 'buy' : 'sell'}`)}
          </div>
        )
      }
    },
    {
      title: <div>{t('properties.payment.number')}</div>,
      dataIndex: 'token_number',
      key: 'token_number',
      render: (_, record) => {
        return (
          <div>
            {formatNumberNoRound(record.number, 8)}
          </div>
        )
      }
    },
    {
      title: <div>{t('properties.payment.token_price')}</div>,
      dataIndex: 'token_number',
      key: 'token_number',
      render: (_, record) => {
        return (
          <div>
            {formatNumberNoRound(record.price, 8)}
          </div>
        )
      }
    },
    {
      title: <div>{t('cancelOrder.sell_date')}</div>,
      dataIndex: 'create_date',
      key: 'create_date',
      render: (_, record) => {
        return <div>{dayjs(record.create_date * 1000).format('YYYY-MM-DD')}</div>
      }
    },
    {
      title: <div>{t('cancelOrder.sell_hash')}</div>,
      dataIndex: 'tx_hash',
      key: 'tx_hash',
      render: (_, record) => {
        return <a href={`${`${envConfig.blockExplorerUrl}/tx/${record.hash}`}`} target="_blank">{record.hash && `${record.hash.slice(0, 6)}...${record.hash.slice(-4)}`}</a>
      }
    },
    {
      title: <div>{t('cancelOrder.orderStatus')}</div>,
      dataIndex: 'status',
      key: 'status',
      render: (_, record) => {
        return (
          <div>
            {t(`cancelOrder.status.${Math.min(record.status, 2)}`)}
          </div>
        )
      }
    }
  ]

  return (
    <div>
      <div className="text-whit mb-10 text-2xl max-lg:mb-5 max-lg:text-xl">{t('aboutMe.buy_record')}</div>
      <div className="max-md:rid-cols-1 grid grid-cols-4 mb-5 gap-4 max-lg:grid-cols-2">
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
          placeholder={t('dividendStatistics.property')}
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
        <Select
          placeholder={t('dividendStatistics.orderType')}
          size="large"
          className={cn(
            '[&_.ant-select-selector]:(bg-transparent! text-white!)',
            '[&_.ant-select-selection-placeholder]:(text-[#898989]!)',
            '[&_.ant-select-selection-item]:(bg-transparent! text-white!)',
            '[&_.ant-select-arrow]:(text-white!)'
          )}
          options={orderTypeList}
          value={selectOrderType}
          onChange={setSelectOrderType}
        />
      </div>
      <ConfigProvider locale={locale}>
        <Table
          key="default-saleRecord-table"
          scroll={{ x: 'max-content' }}
          className="custom-table w-full"
          columns={tableColumns}
          // loading={earningsListLoading}
          dataSource={data?.list || []}
          rowClassName={() => 'custom-table-row'}
          pagination={{
            ...pagination,
            onChange: (page, pageSize) => {
              setPagination({
                ...pagination,
                current: page,
                pageSize
              })
            }
          }}
          loading={isLoading}
          locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description=""><div className="text-white">{t('common.no_data')}</div></Empty> }}
        />
      </ConfigProvider>
    </div>
  )
}
