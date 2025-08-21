import type { PropertieItem } from '@/api/apiMyInfoApi'
import type { TableProps } from 'antd'
import apiMyInfo from '@/api/apiMyInfoApi'
import button2 from '@/assets/icons/BUTTON2-2.png'
import button3 from '@/assets/icons/BUTTON3.png'
import copyIcon from '@/assets/icons/copy.svg'
import group272Icon from '@/assets/icons/group272.png'
import TableComponent from '@/components/common/table-component'
import { useCommonDataStore } from '@/stores/common-data'
import { envConfig } from '@/utils/envConfig'
import { formatNumberNoRound } from '@/utils/number'
import { toBlockchainByHash } from '@/utils/web/utils'
import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { Space } from 'antd'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'

export function MyAssets() {
  const { t } = useTranslation()
  const coinStatus = ['unclaimed', 'claimed', 'withdraw', 'failed', 'sold', 'distribution']
  const copyText = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success(t('common.copy_success'))
  }
  const commonData = useCommonDataStore()

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
              <div className="main-hover cursor-pointer" onClick={() => toBlockchain(record.contract_address)}>
                {t('profile.data_count.token_name')}
                :
                {record.code}
              </div>
            </div>
          </div>
        </>
      )
    },
    {
      title: <div>{t('profile.data_count.purchase_price')}</div>,
      dataIndex: 'purchase_price',
      key: 'purchase_price',
      render: (_, record) => (
        <>
          <div className="flex items-center justify-start">
            <div>{formatNumberNoRound(Number(record.purchase_price), 8)}</div>
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
    {
      title: <div>{t('profile.data_count.valueJpy', { payName: commonData.payTokenName })}</div>,
      key: 'USD',
      render: (_, record) => (
        <>
          <div className="flex items-center justify-start">
            <div className="">{formatNumberNoRound(Number(record.total_current) * Number(record.purchase_price), 8)}</div>
          </div>
        </>
      )
    },
    {
      title: <div>{t('profile.data_count.payment_currency')}</div>,
      key: 'payment_currency',
      render: (_, _record) => (
        <>
          <div className="flex items-center justify-start">
            <div>{commonData.payTokenName}</div>
          </div>
        </>
      )
    },
    {
      title: <div>{t('profile.data_count.token_contract_address')}</div>,
      key: 'token_contract_address',
      dataIndex: 'contract_address',
      render: (_, record) => {
        return (
          <div className="fyc gap-2">
            <span className="cursor-pointer hover:text-primary" onClick={() => toBlockchain(record.contract_address)} title={record.contract_address}>{record.contract_address ? `${record.contract_address.slice(0, 4)}...${record.contract_address.slice(-4)}` : ''}</span>
            <span onClick={() => copyText(record.contract_address)} className="cursor-pointer">
              <img className="size-4" src={copyIcon} alt="" />
            </span>
          </div>
        )
      }
    },
    {
      title: <div>{t('profile.data_count.transaction_hash')}</div>,
      key: 'drwa_hash',
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
      title: <div>{t('profile.data_count.purchase_time')}</div>,
      key: 'payment_currency',
      render: (_, record) => {
        return <div>{dayjs((record.create_date as any as number) * 1000).format('YYYY-MM-DD HH:mm:ss')}</div>
      }
    },
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
  const [overPageInfo, setOverPageInfo] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    refetch: 0
  })
  const [keyword, setKeyword] = useState('')
  const getOverviewData = async () => {
    const res = await apiMyInfo.getMeInfo({
      page: overPageInfo.page,
      pageSize: overPageInfo.pageSize,
      keyword: keyword || undefined
    })
    setOverPageInfo({
      ...overPageInfo,
      total: res.data?.count || 0
    })
    return res
  }
  const { data: overviewData, isFetching } = useQuery({
    queryKey: ['overview', overPageInfo.page, overPageInfo.pageSize, overPageInfo.refetch],
    queryFn: async () => {
      const res = await getOverviewData()
      return res.data?.list
    }
  })
  return (
    <div>
      {/* 资产列表 每次交易都会有一条记录 */}
      <div>
        <div className="fyc flex-inline b b-white rounded-xl b-solid px-4 py-2 max-lg:w-full space-x-4">
          <div className="i-iconamoon-search size-5 shrink-0 bg-[#b5b5b5]"></div>
          <input
            type="text"
            placeholder={t('profile.transactions.search')}
            className="w-128 b-none bg-transparent outline-none max-lg:w-full"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            onKeyUp={(e) => {
              if (e.key === 'Enter') {
                setOverPageInfo({
                  ...overPageInfo,
                  page: 1,
                  refetch: overPageInfo.refetch + 1
                })
              }
            }}
          />
        </div>
      </div>
      <div>
        <TableComponent
          columns={columns}
          data={overviewData || []}
          loading={isFetching}
          key="menu_assets_summary"
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
          <div className="mb-2 text-5">{t('aboutMe.menu_assets_summary')}</div>
        </TableComponent>
      </div>
    </div>
  )
}
