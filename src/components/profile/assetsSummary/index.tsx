import type { PropertyInvestment } from '@/api/apiMyInfoApi'
import type { TableProps } from 'antd'
import apiMyInfoApi from '@/api/apiMyInfoApi'
import button2 from '@/assets/icons/BUTTON2-2.png'
import button3 from '@/assets/icons/BUTTON3.png'
import group272Icon from '@/assets/icons/group272.png'
import TableComponent from '@/components/common/table-component'
import { useQuery } from '@tanstack/react-query'
import { Space } from 'antd'

export function AssetsSummary() {
  const { t } = useTranslation()
  // 表格1配置
  const columns: TableProps<PropertyInvestment>['columns'] = [
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
    total: 0
  })
  const [keyword, setKeyword] = useState('')
  const getOverviewData = async () => {
    const res = await apiMyInfoApi.getMeInfoSummary({
      page: overPageInfo.page,
      pageSize: overPageInfo.pageSize,
      keyword
    })
    setOverPageInfo({
      ...overPageInfo,
      total: res.data?.count || 0
    })
    return res
  }
  const { data: overviewData, isFetching, refetch: refetchOverview } = useQuery({
    queryKey: ['overviewSummary'],
    queryFn: async () => {
      const res = await getOverviewData()
      return res.data?.list
    }
  })
  return (
    <div>
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
                  page: 1
                })
                refetchOverview()
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
          key="summaryRecord"
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
                refetchOverview()
              }
            }
          }
        >
          <div className="mb-2 text-5">{t('profile.myAssets.summaryRecord')}</div>
        </TableComponent>
      </div>
    </div>

  )
}
