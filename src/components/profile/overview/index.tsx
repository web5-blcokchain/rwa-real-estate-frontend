import type { historyResponse, PropertieItem } from '@/api/apiMyInfoApi'
import type { LoginLog } from '@/api/profile'
import type { ConnectedWallet } from '@privy-io/react-auth'
import type { TableProps } from 'antd'
import apiMyInfo from '@/api/apiMyInfoApi'
import { getLoginLogList } from '@/api/profile'
import button2 from '@/assets/icons/BUTTON2-2.png'
import button3 from '@/assets/icons/BUTTON3.png'
import group272Icon from '@/assets/icons/group272.png'
import { PaymentMethod } from '@/components/common/payment-method'
import { useCommonDataStore } from '@/stores/common-data'
import { parseUserAgent } from '@/utils'
import { formatNumberNoRound } from '@/utils/number'
import { useQuery } from '@tanstack/react-query'
import { Space } from 'antd'
import dayjs from 'dayjs'
import DataCount from '../-components/data-count'
import TableComponent from '../../common/table-component'

function Overview() {
  const [wallet, setWallet] = useState<ConnectedWallet | null>(null)
  const { t } = useTranslation()
  const commonData = useCommonDataStore()
  const coinStatus = ['unclaimed', 'claimed', 'withdraw', 'failed', 'sold', 'distribution']

  // 代币持仓表格1配置
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
      title: <div>{t('profile.data_count.valueJpy', { payName: commonData.payTokenName })}</div>,
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
        return <div>{t(`profile.coin.${!(record.status >= 0 && record.status < coinStatus.length && record.status !== null) ? 'locked' : coinStatus[record.status]}`)}</div>
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

  // 收益记录表格2配置
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
      title: <div>{t('profile.data_count.amountJpy', { payName: commonData.payTokenName })}</div>,
      key: 'AmountJPY',
      dataIndex: 'number',
      render: (_, record) => (
        <>
          <div className="flex items-center justify-start">
            <div className="flex flex-col justify-start">
              <div>
                {formatNumberNoRound(record.income_amount, 8)}
                {' '}
                {commonData.payTokenName}
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
            {record.status === 0 && <div>{t('dividendStatistics.unclaimed')}</div>}
            {record.status === 1 && <div>{t('dividendStatistics.sale')}</div>}
            {record.status === 2 && <div>{t('dividendStatistics.sold')}</div>}
            {record.status === 5 && <div>{t('dividendStatistics.distribution')}</div>}
          </div>
        </Space>
      )
    }
  ]

  // 登陆日志记录表格3配置
  const columnsThree: TableProps<LoginLog>['columns'] = [
    // {
    //   title: <div>{t('ID')}</div>,
    //   dataIndex: 'id',
    //   key: 'id'
    // },
    {
      title: <div>{t('profile.overview.login_ip')}</div>,
      dataIndex: 'ip',
      key: 'ip'
    },
    {
      title: <div>{t('profile.overview.login_time')}</div>,
      dataIndex: 'login_date',
      key: 'login_date',
      render: (_, record) => (
        <div>
          {dayjs(record.login_date * 1000).format('YYYY-MM-DD HH:mm:ss')}
        </div>
      )
    },
    {
      title: <div>{t('profile.overview.login_equipment')}</div>,
      key: 'agent',
      dataIndex: 'agent',
      render: (_, record) => (
        <div>
          {parseUserAgent(record.agent)?.browser}
        </div>
      )
    }
  ]
  const [fristLoading, setFristLoading] = useState(false)

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
    setFristLoading(true)
    setOverPageInfo({
      ...overPageInfo,
      total: res.data?.count || 0
    })
    return res
  }
  const { data: overviewData, isLoading, isFetching: overviewIsFetching } = useQuery({
    queryKey: ['overview', overPageInfo.page, overPageInfo.pageSize],
    queryFn: async () => {
      const res = await getOverviewData()
      return res.data?.list
    }
  })

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
  const { data: historyData, isLoading: historyLoading, isFetching: historyIsFetching } = useQuery({
    queryKey: ['history', historyPageInfo.page, historyPageInfo.pageSize],
    queryFn: async () => {
      const res = await getHistoryData()
      return res.data?.list || []
    }
  })

  const [loginLogPageInfo, setLoginLogPageInfo] = useState({
    page: 1,
    pageSize: 10
  })
  // 获取登陆日志
  const { data: loginLigList, isFetching: loginLogLoading } = useQuery({
    queryKey: ['loginLog', loginLogPageInfo.page, loginLogPageInfo.pageSize],
    queryFn: async () => {
      const res = await getLoginLogList({
        page: loginLogPageInfo.page,
        pageSize: loginLogPageInfo.pageSize
      })
      return res.data
    }
  })

  if ((isLoading || historyLoading) && !fristLoading) {
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
            current: overPageInfo.page,
            pageSize: overPageInfo.pageSize,
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
            current: historyPageInfo.page,
            pageSize: historyPageInfo.pageSize,
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

      <TableComponent
        columns={columnsThree}
        key="columnsThree"
        data={loginLigList?.list || []}
        loading={loginLogLoading}
        pagination={
          {
            current: loginLogPageInfo.page,
            pageSize: loginLogPageInfo.pageSize,
            total: loginLigList?.count,
            onChange: (page, pageSize) => {
              setLoginLogPageInfo({
                ...loginLogPageInfo,
                page,
                pageSize
              })
            }
          }
        }
      >
        <div className="mb-2 text-5">{t('profile.overview.login_record')}</div>
      </TableComponent>
    </div>
  )
}

export default Overview
