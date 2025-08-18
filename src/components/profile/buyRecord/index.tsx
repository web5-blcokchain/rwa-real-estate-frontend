import type { PropertyInfo } from '@/api/investment'
import type { TableProps } from 'antd'
import { getAssetType } from '@/api/apiMyInfoApi'
import { cancelOrder, getInvestmentList } from '@/api/investment'
import group272Icon from '@/assets/icons/group272.png'
import { formatNumberNoRound } from '@/utils/number'
import { cancelSellOrder, getTradeContract } from '@/utils/web/tradeContract'
import { useWallets } from '@privy-io/react-auth'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { Button, ConfigProvider, Empty, Input, Select, Table } from 'antd'
import enUS from 'antd/locale/en_US'
import jaJP from 'antd/locale/ja_JP'
import zhCN from 'antd/locale/zh_CN'
import dayjs from 'dayjs'
import { envConfig } from '../../../utils/envConfig'

export function BuyRecord() { // 市场交易购买记录
  const { t } = useTranslation()
  const [keyword, setKeyword] = useState('')
  const [propertyType, setPropertyType] = useState()
  const locale = useMemo(() => i18n.language === 'en' ? enUS : i18n.language === 'zh' ? zhCN : jaJP, [i18n])
  const [pagination, setPagination] = useState({
    pageSize: 10,
    current: 1,
    total: 0,
    showQuickJumper: true,
    showSizeChanger: false
  })
  const searchDataList = async () => {
    const res = await getInvestmentList({
      page: pagination.current,
      keyword,
      order_type: '1',
      pageSize: pagination.pageSize,
      is_me: 1,
      property_type: propertyType === 0 ? undefined : propertyType
      // price_sort: sortType === 0 ? undefined : sortType
    })
    pagination.total = res.data?.count || 0
    return res
  }
  const { data, isFetching: isLoading, refetch } = useQuery({
    queryKey: ['investment-list-buy', pagination.current, propertyType], // 添加 assetType 到查询键
    queryFn: async () => {
      const res = await searchDataList()
      return res.data
    }
  })
  const { wallets } = useWallets()
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

  const { mutateAsync } = useMutation({
    mutationKey: ['cancelOrder'],
    mutationFn: async (orderId: number) => {
      const data = cancelOrder(orderId)
      return data
    }
  })
  const [loading, setLoading] = useState<string>()
  /**
   *
   * @param orderId 订单id
   * @param orderSellId 合约订单id
   * @returns
   */
  async function toCancelOrder(orderId: number, orderSellId: string) {
    const wallet = wallets.find(wallet => wallet.walletClientType !== 'privy')
    if (!orderId || !orderSellId)
      return
    if (!wallet) {
      toast.warning(t('payment_method.please_connect_wallet'))
      return
    }
    setLoading(orderSellId)
    try {
      const ethProvider = await wallet.getEthereumProvider()
      const tradeContact = await getTradeContract(ethProvider)
      const tx = await cancelSellOrder(tradeContact, Number(orderSellId))
      console.log('hash:', tx.hash)
      const data = await mutateAsync(Number(orderId))
      if (data.code === 1) {
        refetch()
        toast.success(t('cancelOrder.success'))
      }
    }
    catch (e: any) {
      console.error(e)
      toast.error(t('payment.errors.transaction_failed'))
    }
    finally {
      setLoading('')
    }
  }

  const tableColumns: TableProps<PropertyInfo>['columns'] = [
    {
      title: <div>{t('id')}</div>,
      dataIndex: 'id',
      key: 'id'
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
                <div>{record.address}</div>
              </Link>
              <div className="text-[#8d909a]">{record.property_type}</div>
              {/* <div className="main-hover cursor-pointer" onClick={() => toBlockchain(record.contract_address)}>
              {t('profile.data_count.token_name')}
              :
              {record.name}
            </div> */}
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
            {record.order_type === 1 ? '出售' : '求购'}
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
            {formatNumberNoRound(record.token_number, 8)}
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
            {formatNumberNoRound(record.token_price, 8)}
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
        return <a href={`${`${envConfig.blockExplorerUrl}/tx/${record.tx_hash}`}`} target="_blank">{record.tx_hash && `${record.tx_hash.slice(0, 6)}...${record.tx_hash.slice(-4)}`}</a>
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
    },
    {
      title: <div>{t('common.operation')}</div>,
      dataIndex: 'properties_id',
      key: 'properties_id',
      render: (_, record) => {
        return (
          <div>
            <Button disabled={record.status === 2 || record.status === 1} loading={record.sell_order_id === loading} onClick={() => toCancelOrder(record.id, record.sell_order_id)} type="primary">
              {t('取消订单')}
            </Button>
          </div>
        )
      }
    }
  ]

  return (
    <div>
      <div className="text-whit mb-10 text-2xl max-lg:mb-5 max-lg:text-xl">{t('aboutMe.sale_record')}</div>
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
