import type { TableProps } from 'antd'
import copyIcon from '@/assets/icons/copy.svg'
import { ProfileTab } from '@/enums/profile'
import { formatNumberNoRound } from '@/utils/number'
import { Button, ConfigProvider, Empty, Table } from 'antd'
import enUS from 'antd/locale/en_US'
import jaJP from 'antd/locale/ja_JP'
import zhCN from 'antd/locale/zh_CN'
import dayjs from 'dayjs'

// 违约警告
export default function DefaultWarning({ setSecondaryMenu, setSecondaryMenuProps }: { setSecondaryMenu: (menu: ProfileTab) => void, setSecondaryMenuProps: (props: any) => void }) {
  const { t } = useTranslation()
  const locale = i18n.language === 'en' ? enUS : i18n.language === 'zh' ? zhCN : jaJP
  const totalInfo = useMemo(() => {
    return [{
      title: 'profile.warning.total_investment_assets',
      num: `$${formatNumberNoRound(1240000)}`
    }, {
      title: 'profile.warning.expected_income_this_month',
      num: `$${formatNumberNoRound(38500)}`
    }, {
      title: 'profile.warning.overdue_assets',
      num: t('profile.warning.overdue_assets_num', { num: 8 })
    }]
  }, [locale])

  interface tableData {
    id: number
    name: string
    address: string
    status: number
    lastPay: string
    nextPay: string
    amount: number
    buyAmount: number
    hash: string
  }

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success(t('common.copy_success'))
  }
  const tableColumns: TableProps<tableData>['columns'] = [
    {
      title: <div>{t('profile.warning.asset_name')}</div>,
      dataIndex: 'id',
      key: 'id',
      width: 380,
      render: (_, record) => {
        return (
          <div className="flex gap-3">
            <div className="relative size-100px overflow-hidden rounded-md">
              <img className="absolute inset-0 left-1/2 top-1/2 h-full !max-w-max -translate-x-1/2 -translate-y-1/2" src="https://dev1.usdable.com/storage/default/20250725/3040-1fd5d90f3b9336d3f22f69ca4b56f1a44df56a31e.jpg" alt="" />
            </div>
            <div className="flex flex-1 flex-col justify-between gap-1 py-2">
              <div className="space-y-2">
                <div title={record.name} className="truncate text-base">{record.name}</div>
                <div title={record.address} className="line-clamp-2 text-sm">{record.address}</div>
              </div>
              <div className="fyc gap-1 text-12px">
                <div>
                  ID:
                  {record.id}
                </div>
                {' '}
                <img onClick={() => copyText(record.id.toString())} className="size-3 cursor-pointer" src={copyIcon} alt="" />
              </div>
            </div>
          </div>
        )
      }
    },
    {
      title: <div>{t('profile.warning.status')}</div>,
      dataIndex: 'status',
      key: 'status',
      render: (_, record) => {
        return <div>{t(`profile.warning.status_map.${record.status + 1}`)}</div>
      }
    },
    {
      title: <div>{t('profile.warning.last_pay')}</div>,
      dataIndex: 'lastPay',
      key: 'lastPay',
      render: (_, record) => {
        return <div>{dayjs(record.lastPay).format('YYYY-MM-DD')}</div>
      }
    },
    {
      title: <div>{t('profile.warning.next_pay')}</div>,
      dataIndex: 'nextPay',
      key: 'nextPay',
      render: (_, record) => {
        return <div>{dayjs(record.nextPay).format('YYYY-MM-DD')}</div>
      }
    },
    {
      title: <div>{t('profile.warning.investment_amount')}</div>,
      dataIndex: 'amount',
      key: 'amount',
      render: (_, record) => {
        return <div>{`$${formatNumberNoRound(record.amount)}`}</div>
      }
    },
    {
      title: <div>{t('profile.warning.current_valuation')}</div>,
      dataIndex: 'buyAmount',
      key: 'buyAmount',
      render: (_, record) => {
        return <div>{`$${formatNumberNoRound(record.buyAmount)}`}</div>
      }
    },
    {
      title: <div>{t('profile.warning.hash')}</div>,
      dataIndex: 'hash',
      key: 'hash',
      render: (_, record) => {
        return (
          <div>
            {
              record.hash && (`${record.hash.slice(0, 6)}...${record.hash.slice(-4)}`)
            }
          </div>
        )
      }
    },
    {
      title: <div>{t('common.operation')}</div>,
      dataIndex: 'hash-2',
      key: 'hash-2',
      render: (_, record) => {
        return (
          <div className="flex gap-1">
            <Button
              disabled={record.status !== 4}
              type="primary"
              onClick={() => {
                setSecondaryMenu(ProfileTab.WarningRedemptionInfo)
                setSecondaryMenuProps({
                  id: record.id
                })
              }}
            >
              {t('profile.recording.asset_redemption')}
            </Button>
            <Button
              type="primary"
              onClick={() => {
                setSecondaryMenu(ProfileTab.WarningInfo)
                setSecondaryMenuProps({
                  id: record.id
                })
              }}
            >
              {t('common.view')}
            </Button>
          </div>
        )
      }
    }
  ]

  const [earningsList, _setEarningsList] = useState<tableData[]>([
    {
      id: 1,
      name: '资产1',
      address: '盐城市射阳县经济开发区滨湖公寓22号楼盐城市射阳县经济开发区滨湖公寓22号楼',
      status: 0,
      lastPay: '2025-01-01',
      nextPay: '2025-01-01',
      amount: 10000,
      buyAmount: 10000,
      hash: ''
    },
    {
      id: 2,
      name: '资产2',
      address: '盐城市射阳县经济开发区滨湖公寓22号楼',
      status: 1,
      lastPay: '2025-01-01',
      nextPay: '2025-01-01',
      amount: 10000,
      buyAmount: 10000,
      hash: ''
    },

    {
      id: 3,
      name: '资产3',
      address: '盐城市射阳县经济开发区滨湖公寓22号楼',
      status: 2,
      lastPay: '2025-01-01',
      nextPay: '2025-01-01',
      amount: 10000,
      buyAmount: 10000,
      hash: ''
    },
    {
      id: 4,
      name: '资产4',
      address: '盐城市射阳县经济开发区滨湖公寓22号楼',
      status: 3,
      lastPay: '2025-01-01',
      nextPay: '2025-01-01',
      amount: 10000,
      buyAmount: 10000,
      hash: ''
    },
    {
      id: 5,
      name: '资产5',
      address: '盐城市射阳县经济开发区滨湖公寓22号楼',
      status: 4,
      lastPay: '2025-01-01',
      nextPay: '2025-01-01',
      amount: 10000,
      buyAmount: 10000,
      hash: '0x1234567890'
    }
  ])
  const pagination: TableProps<tableData>['pagination'] = {
    pageSize: 10,
    current: 1,
    total: 100,
    showQuickJumper: true,
    showSizeChanger: false
  }
  return (
    <div>
      <div className="grid grid-cols-4 gap-8 max-md:grid-cols-1 max-md:gap-4">
        {
          totalInfo.map((item) => {
            return (
              <div key={t(item.title)} className="rounded-md bg-#202329 p-6 space-y-3">
                <div className="truncate text-base text-#B5B5B5" title={t(item.title)}>{t(item.title)}</div>
                <div className="truncate text-2xl text-white" title={item.num}>{item.num}</div>
              </div>
            )
          })
        }
      </div>
      <div className="mt-10">
        <ConfigProvider locale={locale}>
          <Table
            key="default-warning-table"
            scroll={{ x: 'max-content' }}
            className="custom-table w-full"
            columns={tableColumns}
            // loading={earningsListLoading}
            dataSource={earningsList || []}
            rowClassName={() => 'custom-table-row'}
            pagination={pagination}
            // loading={loading}
            locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description=""><div className="text-white">{t('common.no_data')}</div></Empty> }}
          />
        </ConfigProvider>
      </div>
    </div>
  )
}
