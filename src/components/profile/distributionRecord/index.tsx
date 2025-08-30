import type { PropertieItem } from '@/api/apiMyInfoApi'
import type { TableProps } from 'antd'
import apiMyInfo from '@/api/apiMyInfoApi'
import copyIcon from '@/assets/icons/copy.svg'
import group272Icon from '@/assets/icons/group272.png'
import TableComponent from '@/components/common/table-component'
import { useCommonDataStore } from '@/stores/common-data'
import { envConfig } from '@/utils/envConfig'
import { formatNumberNoRound } from '@/utils/number'
import { addTokenToWallet } from '@/utils/wallet'
import { toBlockchainByHash } from '@/utils/web/utils'
import { useWallets } from '@privy-io/react-auth'
import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { Button } from 'antd'
import dayjs from 'dayjs'

// 代币发放记录
export function DistributionRecord() {
  const { t } = useTranslation()
  const coinStatus = ['unclaimed', 'claimed', 'withdraw', 'failed', 'sold', 'distribution']
  const { wallets } = useWallets()
  const commonData = useCommonDataStore()
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
      toast.error(t('profile.data_count.add_token_failed'))
    }
    finally {
      setAddCoinLoading(0)
    }
  }
  const copyText = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success(t('common.copy_success'))
  }
  const toBlockchain = (address: string) => {
    window.open(`${envConfig.blockExplorerUrl}/address/${address}`, '_blank')
  }

  // 表格1配置
  const columns: TableProps<PropertieItem>['columns'] = [
    {
      title: <div>{t('profile.data_count.order_id')}</div>,
      dataIndex: 'code',
      key: 'code'
    },
    {
      title: <div>{t('profile.data_count.asset')}</div>,
      dataIndex: 'total_purchase',
      key: 'Asset',
      render: (_, record) => (
        <>
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
                {record.code}
              </div> */}
            </div>
          </div>
        </>
      )
    },
    {
      title: <div>{t('profile.data_count.amount')}</div>,
      dataIndex: 'number',
      key: 'Amount',
      render: text => <div>{formatNumberNoRound(Number(text), 8)}</div>
    },
    // TODO 价值、占比、24小时变化
    {
      title: <div>{t('profile.data_count.valueJpy', { payName: commonData.payTokenName })}</div>,
      key: 'USD',
      render: (_, record) => (
        <>
          <div className="flex items-center justify-start">
            <div className="">{formatNumberNoRound(Number(record.total_current) * Number(record.current_price), 8)}</div>
          </div>
        </>
      )
    },
    {
      title: <div>{t('profile.data_count.status')}</div>,
      key: 'status',
      render: (_, record) => {
        return <div>{t(`profile.coin.${!(record.status >= 0 && record.status < coinStatus.length && record.status !== null) ? 'locked' : coinStatus[record.status]}`)}</div>
      }
    },
    {
      title: <div>{t('profile.data_count.token_contract_address')}</div>,
      key: 'token_contract_address',
      dataIndex: 'contract_address',
      render: (_, record) => {
        return (
          <div className="fyc gap-2">
            <span
              className="cursor-pointer hover:text-primary"
              onClick={() => toBlockchain(record.contract_address)}
              title={record.contract_address}
            >
              {record.contract_address ? `${record.contract_address.slice(0, 4)}...${record.contract_address.slice(-4)}` : ''}
            </span>
            <span onClick={() => copyText(record.contract_address)} className="cursor-pointer">
              <img className="size-4" src={copyIcon} alt="" />
            </span>
          </div>
        )
      }
    },
    {
      title: <div>{t('profile.data_count.transaction_hash')}</div>,
      key: 'transaction_hash',
      dataIndex: 'drwa_hash',
      render: (_, record) => {
        return (
          <div className="fyc gap-2">
            <span
              className="cursor-pointer hover:text-primary"
              onClick={() => toBlockchainByHash(record.drwa_hash)}
              title={record.drwa_hash}
            >
              {record.drwa_hash ? `${record.drwa_hash.slice(0, 4)}...${record.drwa_hash.slice(-4)}` : ''}
            </span>
            {record.drwa_hash && (
              <span onClick={() => copyText(record.drwa_hash)} className="cursor-pointer">
                <img className="size-4" src={copyIcon} alt="" />
              </span>
            )}
          </div>
        )
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
  const [refetch, setRefetch] = useState(0)
  const [keyword, setKeyword] = useState('')
  const getOverviewData = async () => {
    const res = await apiMyInfo.getMeInfo({
      page: overPageInfo.page,
      pageSize: overPageInfo.pageSize,
      status: 1,
      keyword
    })
    setOverPageInfo({
      ...overPageInfo,
      total: res.data?.count || 0
    })
    return res
  }
  const { data: overviewData, isFetching } = useQuery({
    queryKey: ['distributionRecord——overview', overPageInfo.page, overPageInfo.pageSize, refetch],
    queryFn: async () => {
      const res = await getOverviewData()
      return res.data?.list
    }
  })
  return (
    <div>
      <div className="fyc flex-inline b b-white rounded-xl b-solid px-4 py-2 max-lg:w-full space-x-4">
        <div className="i-iconamoon-search size-5 shrink-0 bg-[#b5b5b5]"></div>
        <input
          type="text"
          placeholder={t('properties.payment.search_asset')}
          className="w-128 b-none bg-transparent outline-none max-lg:w-full"
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          onKeyUp={(e) => {
            if (e.key === 'Enter') {
              setOverPageInfo({
                ...overPageInfo,
                page: 1
              })
              setRefetch(res => res + 1)
            }
          }}
        />
      </div>
      <TableComponent
        columns={columns}
        data={overviewData || []}
        loading={isFetching}
        key="distributionRecord"
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
        <div className="mb-2 text-5">{t('profile.myAssets.distributionRecord')}</div>
      </TableComponent>
    </div>
  )
}
