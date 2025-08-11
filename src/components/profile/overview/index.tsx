import type { historyResponse, PropertieItem } from '@/api/apiMyInfoApi'
import type { ConnectedWallet } from '@privy-io/react-auth'
import type { TableProps } from 'antd'
import apiMyInfo from '@/api/apiMyInfoApi'
import button2 from '@/assets/icons/BUTTON2-2.png'
import button3 from '@/assets/icons/BUTTON3.png'
import group272Icon from '@/assets/icons/group272.png'
import { PaymentMethod } from '@/components/common/payment-method'
import { formatNumberNoRound } from '@/utils/number'
import { useQuery } from '@tanstack/react-query'
import { Space } from 'antd'
import dayjs from 'dayjs'
import DataCount from '../-components/data-count'
import TableComponent from '../../common/table-component'

function Overview() {
  const [wallet, setWallet] = useState<ConnectedWallet | null>(null)
  const { t } = useTranslation()
  const coinStatus = ['unclaimed', 'claimed', 'withdraw', 'failed', 'distribution']

  // 表格1配置
  const columns: TableProps<PropertieItem>['columns'] = [
    {
      title: <div>{t('profile.data_count.asset')}</div>,
      dataIndex: 'total_purchase',
      key: 'Asset',
      render: (_, record) => (
        <>
          <div className="flex items-center justify-start">
            <img src={group272Icon} alt="" className="mr-2 h-6 w-6" />
            <div className="flex flex-col justify-start">
              <div>{record.address}</div>
              <div className="text-[#8d909a]">{record.property_type}</div>
            </div>
          </div>
        </>
      )
    },
    {
      title: <div>{t('profile.data_count.amount')}</div>,
      dataIndex: 'number',
      key: 'Amount',
      render: text => <div>{text}</div>
    },
    {
      title: <div>{t('profile.data_count.valueJpy')}</div>,
      key: 'USD',
      render: (_, record) => (
        <>
          <div className="flex items-center justify-start">
            <div className="">{Number(record.total_current) * Number(record.current_price)}</div>
          </div>
        </>
      )
    },
    // {
    //   title: <div>{t('profile.data_count.change24h')}</div>,
    //   dataIndex: 'expected_annual_return',
    //   key: 'Change'
    // },
    {
      title: <div>{t('profile.data_count.status')}</div>,
      key: 'status',
      render: (_, record) => {
        return <div>{t(`profile.coin.${record.status === -1 ? 'locked' : coinStatus[record.status]}`)}</div>
      }
    },
    {
      title: <div>{t('profile.data_count.draw_time')}</div>,
      key: 'draw_time',
      render: (_, record) => {
        return <div>{dayjs((record.draw_time as any as number) * 1000).format('YYYY-MM-DD HH:mm:ss')}</div>
      }
    },
    {
      title: <div>{t('profile.data_count.action')}</div>,
      key: 'action',
      render: () => (
        <Space size="middle">
          <img src={button3} alt="" className="mr-2 h-6 w-8" />
          <img src={button2} alt="" className="mr-2 h-6 w-8" />
        </Space>
      )
    }
  ]

  // 表格2配置
  const columnsTwo: TableProps<historyResponse>['columns'] = [
    {
      title: <div>{t('profile.data_count.time')}</div>,
      dataIndex: 'income_date',
      key: 'Time'
    },
    {
      title: <div>{t('profile.data_count.type')}</div>,
      dataIndex: 'type',
      key: 'Type',
      render: text => <a>{text}</a>
    },
    {
      title: <div>{t('profile.data_count.asset')}</div>,
      dataIndex: 'Asset',
      key: 'Asset',
      render: (_, record) => (
        <>
          <div className="flex items-center justify-start">
            <div className="flex flex-col justify-start">
              <div>{record.contract_address}</div>
              <div className="text-[#8d909a]">{record?.property_name}</div>
            </div>
          </div>
        </>
      )
    },
    {
      title: <div>{t('profile.data_count.amountJpy')}</div>,
      key: 'AmountJPY',
      dataIndex: 'number',
      render: (_, record) => (
        <>
          <div className="flex items-center justify-start">
            <div className="flex flex-col justify-start">
              <div>
                $
                {formatNumberNoRound(record.income_amount, 8)}
              </div>
              <div className="text-[#8d909a]">
                ≈
                {formatNumberNoRound(Number(record?.income_amount) / Number(record?.price), 8)}
                {' '}
                {t('profile.data_count.token')}
              </div>
            </div>
          </div>
        </>
      )
    },
    {
      title: <div>{t('profile.data_count.status')}</div>,
      key: 'Status',
      render: (_, record) => (
        <Space size="middle">
          <div className="rounded-md bg-#29483a px-2 py-0.5 text-base text-#4c9470 max-2xl:text-sm">
            {t(record.status > 0 && record.status < 2 ? `profile.data_count.claims_status.${record.status}` : '')}
          </div>
        </Space>
      )
    }
  ]

  // 获取代币持仓
  const [overPageInfo, setOverPageInfo] = useState({
    page: 1,
    pageSize: 10,
    total: 0
  })
  const getOverviewData = async () => {
    const res = await apiMyInfo.getMeInfo({
      page: overPageInfo.page,
      pageSize: overPageInfo.pageSize
    })
    setOverPageInfo({
      ...overPageInfo,
      total: res.data?.count || 0
    })
    return res
  }
  const { data: overviewData, isLoading, refetch: refetchOverview, isFetching: overviewIsFetching } = useQuery({
    queryKey: ['overview'],
    queryFn: async () => {
      const res = await getOverviewData()
      return res.data?.list
    }
  })
  useEffect(() => {
    refetchOverview()
  }, [overPageInfo.page, overPageInfo.pageSize])

  // 获取历史收益记录
  const [historyPageInfo, setHistoryPageInfo] = useState({
    page: 1,
    pageSize: 10,
    total: 0
  })
  const getHistoryData = async () => {
    const res = await apiMyInfo.getHistory({
      page: historyPageInfo.page,
      pageSize: historyPageInfo.pageSize
    })
    setHistoryPageInfo({
      ...historyPageInfo,
      total: res.data?.count || 0
    })
    return res
  }
  const { data: historyData, isLoading: historyLoading, isFetching: historyIsFetching, refetch: refetchHistory } = useQuery({
    queryKey: ['history'],
    queryFn: async () => {
      const res = await getHistoryData()
      return res.data?.list || []
    }
  })
  useEffect(() => {
    refetchHistory()
  }, [historyPageInfo.page, historyPageInfo.pageSize])

  if (isLoading || historyLoading) {
    return (
      <Waiting
        className="h-32 fcc"
        iconClass="size-8"
      >
      </Waiting>
    )
  }

  return (
    <div className="space-y-8">
      <DataCount />

      <PaymentMethod
        walletState={[wallet, setWallet]}
        className="bg-[#202329]"
      />

      <TableComponent
        columns={columns}
        key="columns"
        data={overviewData || []}
        loading={overviewIsFetching}
        pagination={
          {
            defaultCurrent: overPageInfo.page,
            defaultPageSize: overPageInfo.pageSize,
            total: overPageInfo.total,
            onChange: (page, pageSize) => {
              setOverPageInfo({
                ...overPageInfo,
                page,
                pageSize
              })
            }
          }
        }
      >
        <div className="mb-2 text-5">{t('profile.data_count.tokenHoldings')}</div>
      </TableComponent>

      <TableComponent<historyResponse>
        columns={columnsTwo}
        key="columnsTwo"
        data={historyData || []}
        loading={historyIsFetching}
        pagination={
          {
            defaultCurrent: historyPageInfo.page,
            defaultPageSize: historyPageInfo.pageSize,
            total: historyPageInfo.total,
            onChange: (page, pageSize) => {
              setHistoryPageInfo({
                ...historyPageInfo,
                page,
                pageSize
              })
            }
          }
        }
      >
        <div className="mb-2 text-5">{t('profile.data_count.earningsHistory')}</div>
      </TableComponent>
    </div>
  )
}

export default Overview
