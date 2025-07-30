import type { historyResponse } from '@/api/apiMyInfoApi'
import type { TableProps } from 'antd'
import apiMyInfoApi, { getEarningsInfo } from '@/api/apiMyInfoApi'
import copyIcon from '@/assets/icons/copy.svg'
import { useQuery } from '@tanstack/react-query'
import { ConfigProvider, Empty, Select, Table } from 'antd'
import enUS from 'antd/locale/en_US'
import jaJP from 'antd/locale/ja_JP'
import zhCN from 'antd/locale/zh_CN'
import dayjs from 'dayjs'
import numbro from 'numbro'
import '../message/index.scss'
import '/src/components/common/table-component/styles.scss'

export default function DividendStatistics() {
  const { t, i18n } = useTranslation()
  const locale = i18n.language === 'en' ? enUS : i18n.language === 'zh' ? zhCN : jaJP
  const propertyTypeList = [
    { label: <div>{t('dividendStatistics.all')}</div>, value: 'all' },
    { label: <div>{t('dividendStatistics.house')}</div>, value: 'house' },
    { label: <div>{t('dividendStatistics.business')}</div>, value: 'business' },
    { label: <div>{t('dividendStatistics.personal')}</div>, value: 'personal' }
  ]
  const houseStatusList = [
    { label: <div>{t('dividendStatistics.all')}</div>, value: 'all' },
    { label: <div>{t('dividendStatistics.sale')}</div>, value: 'sale' },
    { label: <div>{t('dividendStatistics.rent')}</div>, value: 'rent' },
    { label: <div>{t('dividendStatistics.sold')}</div>, value: 'sold' }
  ]
  const [propertyType, setPropertyType] = useState()
  const [houseStatus, setHouseStatus] = useState()
  const { data: earningsInfo, isFetching: earningsLoading } = useQuery({
    queryKey: ['earningsInfo'],
    queryFn: async () => {
      const data = await getEarningsInfo()
      return data.data
    }
  })
  const [pagination, _setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 100,
    showQuickJumper: true,
    showSizeChanger: false
  })
  const { data: earningsList, isFetching: earningsListLoading } = useQuery({
    queryKey: ['earningsList', pagination.current, pagination.pageSize],
    queryFn: async () => {
      const data = await apiMyInfoApi.getHistory({
        page: pagination.current,
        pageSize: pagination.pageSize
      })
      return data.data?.list || []
    }
  })
  useEffect(() => {
    _setPagination({
      ...pagination,
      total: earningsList?.length || 0
    })
  }, [earningsList])

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
            $
            {numbro(record.total_amount).format({ mantissa: 2, thousandSeparated: true })}
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
            $
            {numbro(totalAmount - incomeAmount).format({ mantissa: 2, thousandSeparated: true })}
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
            $
            {numbro(record.income_amount).format({ mantissa: 2, thousandSeparated: true })}
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
            <span title={record.tx_hash}>{record.tx_hash ? `${record.tx_hash.slice(0, 4)}...${record.tx_hash.slice(-4)}` : ''}</span>
            <span onClick={() => copyText(record.tx_hash)} className="cursor-pointer">
              <img className="size-4" src={copyIcon} alt="" />
            </span>
          </div>
        )
      }
    },
    {
      title: <div>{t('dividendStatistics.time')}</div>,
      dataIndex: 'income_date',
      key: 'income_date',
      render: (_, record) => {
        return <div>{dayjs(record.income_date).format('YYYY-MM-DD HH:mm:ss')}</div>
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
        <div className="fyc justify-between rounded-md bg-#212328 px-23 py-18 [&>div>div]:fccc [&>div>div]:gap-3 max-lg:px-4 max-lg:py-8 [&>div]:text-center [&>div>div:first-child]:text-2xl [&>div>div:last-child]:text-base [&>div>div:last-child]:text-[#8d909a] [&>div>div]:max-lg:gap-6px [&>div>div:first-child]:max-lg:text-xl [&>div>div:last-child]:max-lg:text-sm">
          <div>
            <div>
              $
              {earningsInfo?.current_month_income}
            </div>
            <div>{t('dividendStatistics.currentMonthIncome')}</div>
          </div>
          <div>
            <div>
              $
              {earningsInfo?.total_income}
            </div>
            <div>{t('dividendStatistics.totalIncome')}</div>
          </div>
          <div>
            <div>
              $
              {earningsInfo?.avg_month_income}
            </div>
            <div>{t('dividendStatistics.avgMonthIncome')}</div>
          </div>
        </div>
      </Waiting>
      <div>
        <div className="mt-4 fyc gap-5 text-base max-lg:flex-col max-lg:items-start max-lg:text-sm">
          <div className="fyc gap-5 [&>div]:cursor-pointer">
            <div>{t('dividendStatistics.thisMonth')}</div>
            <div>{t('dividendStatistics.last3Months')}</div>
            <div>{t('dividendStatistics.last6Months')}</div>
          </div>
          <div className="fyc gap-5">
            <Select placeholder={t('dividendStatistics.property')} className="input-placeholder w-80px max-lg:w-100px [&>div]:!b-0 [&>div]:!bg-transparent" options={propertyTypeList} value={propertyType} onChange={setPropertyType} />
            <Select placeholder={t('dividendStatistics.status')} className="input-placeholder w-120px max-lg:w-100px [&>div]:!b-0 [&>div]:!bg-transparent" options={houseStatusList} value={houseStatus} onChange={setHouseStatus} />
          </div>
        </div>
        <div className="mt-4 rounded-md bg-#212328 p-4">
          <ConfigProvider locale={locale}>
            <Table
              scroll={{ x: 'max-content' }}
              className="custom-table w-full"
              columns={tableColumns}
              loading={earningsListLoading}
              dataSource={earningsList}
              rowClassName={() => 'custom-table-row'}
              pagination={pagination}
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
