import type { PropertieItem } from '@/api/apiMyInfoApi'
import type { TableProps } from 'antd'
import apiMyInfo from '@/api/apiMyInfoApi'
import group272Icon from '@/assets/icons/group272.png'
import TableComponent from '@/components/common/table-component'
import { addTokenToWallet } from '@/utils/wallet'
import { useWallets } from '@privy-io/react-auth'
import { useQuery } from '@tanstack/react-query'
import { Button } from 'antd'
import dayjs from 'dayjs'

export function DistributionRecord() {
  const { t } = useTranslation()
  const coinStatus = ['unclaimed', 'claimed', 'withdraw', 'failed']
  const { wallets } = useWallets()

  const [addCoinLoading, setAddCoinLoading] = useState(0)
  const addCoinToWallet = async (address: string, index: number) => {
    setAddCoinLoading(index)
    let wallet = wallets.find(wallet => wallet.walletClientType !== 'privy')
    wallet = wallet || wallets[0]
    if (!wallet) {
      toast.error(t('payment_method.please_connect_wallet'))
      setAddCoinLoading(0)
      return
    }
    try {
      await addTokenToWallet(wallet, address)
      toast.success(t('profile.data_count.add_token_success'))
    }
    catch (e) {
      console.error(e)
    }
    finally {
      setAddCoinLoading(0)
    }
  }

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
              <div>
                {t('profile.data_count.token_name')}
                :
                {record.name}
              </div>
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
    // TODO 价值、占比、24小时变化
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
      title: <div>{t('profile.data_count.status')}</div>,
      key: 'status',
      render: (_, record) => {
        return <div>{t(`profile.coin.${record.status === -1 ? 'locked' : coinStatus[record.status]}`)}</div>
      }
    },
    {
      title: <div>{t('profile.data_count.token_contract_address')}</div>,
      key: 'token_contract_address',
      dataIndex: 'contract_address'
    },
    {
      title: <div>{t('profile.data_count.transaction_hash')}</div>,
      key: 'transaction_hash',
      dataIndex: 'drwa_hash',
      render: (_, record) => {
        return <a href={`${import.meta.env.VITE_PUBLIC_WEB_BLOCK_URL}/tx/${record?.drwa_hash}`} target="_blank">{record?.drwa_hash}</a>
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
      render: (_, record) => (
        <div>
          <Button loading={addCoinLoading === record.id} onClick={() => addCoinToWallet(record.contract_address, record.id)} type="primary" size="small">{t('profile.data_count.add_to_wallet')}</Button>
        </div>
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
      pageSize: overPageInfo.pageSize,
      status: 1
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
  return (
    <div>
      <TableComponent
        columns={columns}
        data={overviewData || []}
        loading={isLoading}
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
        <div className="mb-2 text-5">{t('profile.myAssets.distributionRecord')}</div>
      </TableComponent>
    </div>
  )
}
