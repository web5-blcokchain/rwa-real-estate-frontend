import type { historyResponse } from '@/api/apiMyInfoApi'
import type { TableProps } from 'antd'
import apiMyInfoApi, { getAssetType, getEarningsInfo } from '@/api/apiMyInfoApi'
import copyIcon from '@/assets/icons/copy.svg'
import { useCommonDataStore } from '@/stores/common-data'
import { formatNumberNoRound } from '@/utils/number'
import { toBlockchainByHash } from '@/utils/web/utils'
import { useQuery } from '@tanstack/react-query'
import { ConfigProvider, Empty, Select, Table } from 'antd'
import enUS from 'antd/locale/en_US'
import jaJP from 'antd/locale/ja_JP'
import zhCN from 'antd/locale/zh_CN'
import dayjs from 'dayjs'
import '../message/index.scss'
import '/src/components/common/table-component/styles.scss'

export default function DividendStatistics() {
  const { t, i18n } = useTranslation()
  const locale = i18n.language === 'en' ? enUS : i18n.language === 'zh' ? zhCN : jaJP
  const [propertyTypeList, setPropertyTypeList] = useState([
    { label: <div>{t('dividendStatistics.all')}</div>, value: 0 }
  ])
  // 0为未发放 1为已发放 2为发放失败 5为发放中
  const houseStatusList = [
    { label: <div>{t('dividendStatistics.all')}</div>, value: 'all' }, // 全部
    { label: <div>{t('dividendStatistics.sale')}</div>, value: ' 1' }, // 已到账
    { label: <div>{t('dividendStatistics.unclaimed')}</div>, value: '0' }, // 未发放
    { label: <div>{t('dividendStatistics.distribution')}</div>, value: '5' }, // 发放中
    { label: <div>{t('dividendStatistics.sold')}</div>, value: '2' } // 失败
  ]
  const [propertyType, setPropertyType] = useState()
  const [houseStatus, setHouseStatus] = useState()
  // 获取分红综合信息
  const { data: earningsInfo, isFetching: earningsLoading } = useQuery({
    queryKey: ['earningsInfo'],
    queryFn: async () => {
      const data = await getEarningsInfo()
      return data.data
    }
  })

  // 获取房产类型
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

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 100,
    showQuickJumper: true,
    showSizeChanger: false
  })
  const [timeAction, setTimeAction] = useState('')
  // 获取分红列表
  const { data: earningsList, isFetching: earningsListLoading } = useQuery({
    queryKey: ['earningsList', pagination.current, pagination.pageSize, timeAction, houseStatus, propertyType],
    queryFn: async () => {
      const data = await apiMyInfoApi.getHistory({
        page: pagination.current,
        pageSize: pagination.pageSize,
        timeFilter: timeAction === '' ? undefined : (timeAction === '0' ? 'this_month' : timeAction === '1' ? 'three_months' : timeAction === '2' ? 'six_months' : ''),
        status: (houseStatus === 'all' || !houseStatus) ? undefined : Number(houseStatus),
        property_type: (!propertyType) ? undefined : propertyType
      })
      return data.data
    }
  })
  useEffect(() => {
    setPagination({
      ...pagination,
      total: earningsList?.count || 0
    })
  }, [earningsList])

  const commonData = useCommonDataStore()
  const copyText = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success(t('common.copy_success'))
  }

  const tableColumns: TableProps<historyResponse>['columns'] = [
    {
      title: <div>{t('dividendStatistics.id')}</div>,
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: <div>{t('dividendStatistics.name')}</div>,
      dataIndex: 'property_name',
      key: 'property_name'
    },
    {
      title: <div>{t('dividendStatistics.price')}</div>,
      dataIndex: 'total_amount',
      key: 'total_amount',
      render: (_, record) => {
        return (
          <div>
            {formatNumberNoRound(record.total_amount, 8)}
            {' '}
            {commonData.payTokenName}
          </div>
        )
      }
    },
    {
      title: <div>{t('dividendStatistics.handlingFee')}</div>,
      dataIndex: 'handlingFee',
      key: 'handlingFee',
      render: (_, record) => {
        const totalAmount = Number(record.total_amount) || 0
        const incomeAmount = Number(record.income_amount) || 0
        return (
          <div>
            {formatNumberNoRound(totalAmount - incomeAmount, 8)}
            {' '}
            {commonData.payTokenName}
          </div>
        )
      }
    },
    {
      title: <div>{t('dividendStatistics.checkInPrice')}</div>,
      dataIndex: 'income_amount',
      key: 'income_amount',
      render: (_, record) => {
        return (
          <div>
            {formatNumberNoRound(record.income_amount, 8)}
            {' '}
            {commonData.payTokenName}
          </div>
        )
      }
    },
    {
      title: <div>{t('dividendStatistics.checkInStatus')}</div>,
      dataIndex: 'status',
      key: 'status',
      render: (_, record) => {
        return (
          <div className={cn(record.status === 0 && 'text-#0A84FF', record.status === 1 && 'text-#32D74B', record.status === 2 && 'text-#FF453A')}>
            {record.status === 0 && <div>{t('dividendStatistics.unclaimed')}</div>}
            {record.status === 1 && <div>{t('dividendStatistics.sale')}</div>}
            {record.status === 2 && <div>{t('dividendStatistics.sold')}</div>}
            {record.status === 5 && <div>{t('dividendStatistics.distribution')}</div>}
          </div>
        )
      }
    },
    {
      title: <div>{t('dividendStatistics.hash')}</div>,
      dataIndex: 'tx_hash',
      key: 'tx_hash',
      render: (_, record) => {
        return (
          <div className="fyc gap-2">
            <span
              className="cursor-pointer hover:text-primary"
              onClick={() => toBlockchainByHash(record.tx_hash)}
              title={record.tx_hash}
            >
              {record.tx_hash ? `${record.tx_hash.slice(0, 4)}...${record.tx_hash.slice(-4)}` : ''}
            </span>
            {record.tx_hash && (
              <span onClick={() => copyText(record.tx_hash)} className="cursor-pointer">
                <img className="size-4" src={copyIcon} alt="" />
              </span>
            )}
          </div>
        )
      }
    },
    {
      title: <div>{t('dividendStatistics.time')}</div>,
      dataIndex: 'income_date',
      key: 'income_date',
      render: (_, record) => {
        return <div>{dayjs((Number(record.income_date) || 0) * 1000).format('YYYY-MM-DD HH:mm:ss')}</div>
      }
    }
  ]

  return (
    <div className="flex flex-col gap-4">
      <div className="text-whit text-2xl max-lg:text-xl">{t('dividendStatistics.title')}</div>
      <Waiting
        for={!earningsLoading}
        className="w-full fcc"
        iconClass="size-6 bg-white"
      >
        <div className="fyc justify-between rounded-md bg-#212328 px-23 py-14 [&>div>div]:fccc [&>div>div]:gap-3 max-lg:px-4 max-lg:py-8 [&>div]:text-center [&>div>div:first-child]:text-2xl [&>div>div:last-child]:text-base [&>div>div:last-child]:text-[#8d909a] [&>div>div]:max-lg:gap-6px [&>div>div:first-child]:max-lg:text-xl [&>div>div:last-child]:max-lg:text-sm">
          <div>
            <div>
              {earningsInfo?.current_month_income}
              {' '}
              {commonData.payTokenName}
            </div>
            <div>{t('dividendStatistics.currentMonthIncome')}</div>
          </div>
          <div>
            <div>
              {earningsInfo?.total_income}
              {' '}
              {commonData.payTokenName}
            </div>
            <div>{t('dividendStatistics.totalIncome')}</div>
          </div>
          <div>
            <div>
              {earningsInfo?.avg_month_income}
              {' '}
              {commonData.payTokenName}
            </div>
            <div>{t('dividendStatistics.avgMonthIncome')}</div>
          </div>
        </div>
      </Waiting>
      <div>
        <div className="mt-4 fyc gap-5 text-base max-lg:flex-col max-lg:items-start max-lg:text-sm">
          <div className="fyc gap-5 [&>div]:cursor-pointer [&>div]:rounded-md [&>.action]:bg-#212328 [&>div]:px-4 [&>div]:py-1 [&>div]:transition-all [&>div]:duration-300">
            <div onClick={() => setTimeAction(timeAction === '0' ? '' : '0')} className={cn(timeAction === '0' ? 'action' : '')}>{t('dividendStatistics.thisMonth')}</div>
            <div onClick={() => setTimeAction(timeAction === '1' ? '' : '1')} className={cn(timeAction === '1' ? 'action' : '')}>{t('dividendStatistics.last3Months')}</div>
            <div onClick={() => setTimeAction(timeAction === '2' ? '' : '2')} className={cn(timeAction === '2' ? 'action' : '')}>{t('dividendStatistics.last6Months')}</div>
          </div>
          <div className="fyc gap-5">
            <Select placeholder={t('dividendStatistics.property')} className="input-placeholder w-160px max-lg:w-100px [&>div]:!b-0 [&>div]:!bg-transparent" options={propertyTypeList} value={propertyType} onChange={setPropertyType} />
            <Select placeholder={t('dividendStatistics.status')} className="input-placeholder w-120px max-lg:w-100px [&>div]:!b-0 [&>div]:!bg-transparent" options={houseStatusList} value={houseStatus} onChange={setHouseStatus} />
          </div>
        </div>
        <div className="mt-4 rounded-md bg-#212328 p-4">
          <ConfigProvider locale={locale}>
            <Table
              key="DividendStatistics-table"
              scroll={{ x: 'max-content' }}
              className="custom-table w-full"
              columns={tableColumns}
              loading={earningsListLoading}
              dataSource={earningsList?.list || []}
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
              // loading={loading}
              locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description=""><div className="text-white">{t('common.no_data')}</div></Empty> }}
            />
          </ConfigProvider>
        </div>
      </div>
      {/* 分红表格信息 */}

    </div>
  )
}
