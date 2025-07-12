import type { TableProps } from 'antd'
import { getTransactions } from '@/api/transaction'
import TableComponent from '@/components/common/table-component'
import { useQuery } from '@tanstack/react-query'
import { ConfigProvider, DatePicker, Pagination } from 'antd'
import enLocale from 'antd/locale/en_US'
import jpLocale from 'antd/locale/ja_JP'
import zhLocale from 'antd/locale/zh_CN'
import dayjs from 'dayjs'

function Recording() {
  const { t, i18n } = useTranslation()

  const [keyword, setKeyword] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  const pageSize = 20

  const { data: transactionsData, isLoading } = useQuery({
    queryKey: ['get-transactions', page, keyword, pageSize],
    queryFn: async () => {
      const res = await getTransactions({
        page,
        keyword,
        pageSize
      })

      setTotal(_get(res.data, 'count', 0))
      return _get(res.data, 'list', [])
    }
  })

  const columns: TableProps['columns'] = [
    {
      title: <div>{t('profile.common.date')}</div>,
      dataIndex: 'create_date',
      render(value) {
        return (
          <div>
            {dayjs(value).format('YYYY-MM-DD')}
          </div>
        )
      }
    },
    {
      title: <div>{t('profile.common.asset')}</div>,
      key: 'name',
      dataIndex: 'name'
    },
    {
      title: <div>{t('profile.common.type')}</div>,
      key: 'type',
      dataIndex: 'type',
      render(value) {
        let typeName
        switch (value) {
          case 1:
            typeName = t('profile.recording.primary_subscription')
            break
          case 2:
            typeName = t('profile.recording.asset_redemption')
            break
          case 3:
            typeName = t('profile.recording.sell_order')
            break
          case 4:
            typeName = t('profile.recording.buy_order')
            break
        }

        return (
          <div>
            {typeName}
          </div>
        )
      }
    },
    {
      title: <div>{t('profile.common.price')}</div>,
      key: 'price',
      dataIndex: 'price'
    },
    {
      title: <div>{t('profile.common.total_money')}</div>,
      key: 'total_money',
      dataIndex: 'total_money'
    }
  ]

  function handleSearch(value: string) {
    setKeyword(value)
  }

  return (
    <div className="text-white space-y-6">
      <div className="grid grid-cols-4 gap-4 rounded-xl bg-[#1e2024] p-6 max-lg:grid-cols-1">
        <div className="fyc flex-inline b b-white rounded-xl b-solid px-4 py-2 space-x-4">
          <div className="i-iconamoon-search size-5 shrink-0 bg-[#b5b5b5]"></div>
          <input
            type="text"
            placeholder={t('profile.transactions.search')}
            className="w-128 b-none bg-transparent outline-none"
            value={keyword}
            onChange={e => handleSearch(e.target.value)}
          />
        </div>
        <ConfigProvider locale={i18n.language === 'zh' ? zhLocale : i18n.language === 'jp' ? jpLocale : enLocale}>
          <DatePicker
            placeholder={t('profile.transactions.start_date')}
            className="of-hidden b b-white rounded-xl b-solid"
          />
          <DatePicker
            placeholder={t('profile.transactions.end_date')}
            className="of-hidden b b-white rounded-xl b-solid"
          />
        </ConfigProvider>
      </div>

      <Waiting
        for={!isLoading}
        className="h-32 fcc"
        iconClass="size-8"
      >
        <TableComponent
          columns={columns}
          data={transactionsData}
        />
      </Waiting>

      <div className="flex justify-end">
        <Pagination
          current={page}
          pageSize={20}
          total={total}
          onChange={page => setPage(page)}
          className="mt-4"
        />
      </div>
    </div>
  )
}

export default Recording
