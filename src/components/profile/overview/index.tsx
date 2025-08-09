import type { historyResponse, PropertieItem } from '@/api/apiMyInfoApi'
import type { ConnectedWallet } from '@privy-io/react-auth'
import type { TableProps } from 'antd'
import apiMyInfo from '@/api/apiMyInfoApi'
import button2 from '@/assets/icons/BUTTON2-2.png'
import button3 from '@/assets/icons/BUTTON3.png'
import frame115 from '@/assets/icons/Frame115.png'
import group272Icon from '@/assets/icons/group272.png'
import { PaymentMethod } from '@/components/common/payment-method'
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
      render: text => <a>{text}</a>
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
    {
      title: <div>{t('profile.data_count.change24h')}</div>,
      dataIndex: 'expected_annual_return',
      key: 'Change'
    },
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
              <div>{record.user_address}</div>
              <div className="text-[#8d909a]">TKYT</div>
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
              <div>{record.number}</div>
              <div className="text-[#8d909a]">≈ 25.4 TKYT</div>
            </div>
          </div>
        </>
      )
    },
    {
      title: <div>{t('profile.data_count.status')}</div>,
      key: 'Status',
      render: () => (
        <Space size="middle">
          <img src={frame115} alt="" className="img-frame115" />
        </Space>
      )
    }
  ]

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
  const { data: overviewData, isLoading, refetch: refetchOverview } = useQuery({
    queryKey: ['overview'],
    queryFn: async () => {
      const res = await getOverviewData()
      return res.data?.list
    }
  })

  const { data: historyData, isLoading: historyLoading } = useQuery({
    queryKey: ['history'],
    queryFn: async () => {
      const res = await apiMyInfo.getHistory({
        page: 1,
        pageSize: 10
      })
      return res.data?.list || []
    }
  })

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
              refetchOverview()
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
      >
        <div className="mb-2 text-5">{t('profile.data_count.earningsHistory')}</div>
      </TableComponent>
    </div>
  )
}

export default Overview
