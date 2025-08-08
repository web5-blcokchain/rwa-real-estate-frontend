import type { AssetsWarningList } from '@/api/assets'
import type { TableProps } from 'antd'
import { getInvestmentDetails, getWarningList } from '@/api/assets'
import copyIcon from '@/assets/icons/copy.svg'
import { ProfileTab } from '@/enums/profile'
import { formatNumberNoRound } from '@/utils/number'
import { useQuery } from '@tanstack/react-query'
import { Button, ConfigProvider, Empty, Table } from 'antd'
import enUS from 'antd/locale/en_US'
import jaJP from 'antd/locale/ja_JP'
import zhCN from 'antd/locale/zh_CN'
import dayjs from 'dayjs'

// 违约警告
export default function DefaultWarning({ setSecondaryMenu, setSecondaryMenuProps }: { setSecondaryMenu: (menu: ProfileTab) => void, setSecondaryMenuProps: (props: any) => void }) {
  const { t } = useTranslation()
  const locale = i18n.language === 'en' ? enUS : i18n.language === 'zh' ? zhCN : jaJP
  const { data: investmentDetails, isFetching: investmentDetailsLoading } = useQuery({
    queryKey: ['getInvestmentDetails'],
    queryFn: async () => {
      const data = await getInvestmentDetails()
      return data.data
    }
  })

  const totalInfo = useMemo(() => {
    return [{
      title: 'profile.warning.total_investment_assets',
      num: `$${formatNumberNoRound(investmentDetails?.total_number, 8)}`
    }, {
      title: 'profile.warning.expected_income_this_month',
      num: `$${formatNumberNoRound(investmentDetails?.monthly_income, 8)}`
    }, {
      title: 'profile.warning.overdue_assets',
      num: t('profile.warning.overdue_assets_num', { num: investmentDetails?.count })
    }]
  }, [locale, investmentDetails])

  const [pagination, setPagination] = useState({
    pageSize: 10,
    current: 1,
    total: 0,
    showQuickJumper: true,
    showSizeChanger: false
  })

  const { data, isFetching: isLoading } = useQuery({
    queryKey: ['warningList', pagination.current, pagination.pageSize],
    queryFn: async () => {
      const data = await getWarningList({ page: pagination.current, pageSize: pagination.pageSize })
      return data.data
    }
  })

  useEffect(() => {
    if (typeof data?.count === 'number') {
      setPagination({
        ...pagination,
        total: data.count
      })
    }
  }, [data])

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success(t('common.copy_success'))
  }
  const tableColumns: TableProps<AssetsWarningList>['columns'] = [
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
        return <div>{t(record.status > 0 && record.status <= 9 ? `profile.warning.status_map.${record.status}` : '')}</div>
      }
    },
    {
      title: <div>{t('profile.warning.last_pay')}</div>,
      dataIndex: 'rent_due_date',
      key: 'rent_due_date',
      render: (_, record) => {
        return <div>{dayjs(record.rent_due_date).format('YYYY-MM-DD')}</div>
      }
    },
    {
      title: <div>{t('profile.warning.next_pay')}</div>,
      dataIndex: 'next_rent_due_date',
      key: 'next_rent_due_date',
      render: (_, record) => {
        return <div>{dayjs(record.next_rent_due_date).format('YYYY-MM-DD')}</div>
      }
    },
    {
      title: <div>{t('profile.warning.investment_amount')}</div>,
      dataIndex: 'total_current',
      key: 'total_current',
      render: (_, record) => {
        return <div>{`$${formatNumberNoRound(record.number, 8)}`}</div>
      }
    },
    {
      title: <div>{t('profile.warning.current_valuation')}</div>,
      dataIndex: 'price',
      key: 'price',
      render: (_, record) => {
        return <div>{`$${formatNumberNoRound(Number(record.price) * Number(record.number), 8)}`}</div>
      }
    },
    {
      title: <div>{t('profile.warning.hash')}</div>,
      dataIndex: 'tx_hash',
      key: 'tx_hash',
      render: (_, record) => {
        return (
          <div>
            {
              record.tx_hash && (`${record.tx_hash.slice(0, 6)}...${record.tx_hash.slice(-4)}`)
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
              disabled={record.status < 6}
              type="primary"
              onClick={() => {
                setSecondaryMenu(ProfileTab.WarningRedemptionInfo)
                setSecondaryMenuProps({
                  id: record.id,
                  name: record.name,
                  address: record.address,
                  contract_address: record.contract_address,
                  assets_id: record.properties_id
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
                  id: record.id,
                  status: record.status,
                  name: record.name,
                  address: record.address,
                  monthly_rent: record.monthly_rent,
                  rent_due_date: record.rent_due_date
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

  // const testButton = () => {
  //   setSecondaryMenu(ProfileTab.WarningRedemptionInfo)
  //   setSecondaryMenuProps({
  //     id: 22,
  //     name: '',
  //     address: '',
  //     contract_address: '0x5666A1066654388145FaD28876BF3633208ea07F'
  //   })
  // }

  return (
    <div>
      <div className={cn(investmentDetailsLoading && 'h-120px', 'fccc w-full')}>
        <Waiting for={!investmentDetailsLoading}>
          <div className="grid grid-cols-4 w-full gap-8 max-md:grid-cols-1 max-md:gap-4">

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
        </Waiting>
      </div>
      <div className="mt-10">
        <ConfigProvider locale={locale}>
          <Table
            key="default-warning-table"
            scroll={{ x: 'max-content' }}
            className="custom-table w-full"
            columns={tableColumns}
            // loading={earningsListLoading}
            dataSource={data?.list || []}
            rowClassName={() => 'custom-table-row'}
            pagination={pagination}
            loading={isLoading}
            locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description=""><div className="text-white">{t('common.no_data')}</div></Empty> }}
          />
        </ConfigProvider>
      </div>
      {/* <Button onClick={() => testButton()}>测试按钮</Button> */}
    </div>
  )
}
