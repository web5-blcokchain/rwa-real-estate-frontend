import type { TableProps } from 'antd'
import { cancelTransaction as cancelTransactionApi, getTransactionStatus } from '@/api/transaction'
import TableComponent from '@/components/common/table-component'
import { useQuery } from '@tanstack/react-query'
import { Button, Pagination } from 'antd'
import dayjs from 'dayjs'
import SelectComponent from '../-components/select-component'

export const TransactionStatus: FC = () => {
  const { t } = useTranslation()

  const [keyword, setKeyword] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [cancellingId, setCancellingId] = useState<number>(0)

  const pageSize = 20

  const { data: transactionsData, isLoading, refetch } = useQuery({
    queryKey: ['get-transaction-status', page, keyword, pageSize],
    queryFn: async () => {
      const res = await getTransactionStatus({
        page,
        keyword,
        pageSize
      })

      setTotal(_get(res.data, 'count', 0))
      return _get(res.data, 'list', [])
    }
  })

  const assetTypeOptions = [
    { label: <div>{t('profile.transaction_status.all')}</div>, value: 'all' },
    { label: <div>{t('profile.transaction_status.apartment')}</div>, value: 'apartment' },
    { label: <div>{t('profile.transaction_status.house')}</div>, value: 'house' },
    { label: <div>{t('profile.transaction_status.land')}</div>, value: 'land' },
    { label: <div>{t('profile.transaction_status.commercial')}</div>, value: 'commercial' }
  ]

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
      key: 'asset_name',
      dataIndex: 'asset_name'
    },
    {
      title: <div>{t('profile.common.number_of_tokens')}</div>,
      key: 'token_info',
      dataIndex: 'token_info'
    },
    {
      title: <div>{t('profile.common.status')}</div>,
      key: 'status',
      dataIndex: 'status',
      render(value) {
        let typeName
        let typeClass
        switch (value) {
          case 0:
            typeName = 'Selling'
            typeClass = 'text-green-6 bg-[#1e4939]'
            break
          case 1:
            typeName = 'Sold'
            typeClass = 'text-black bg-primary'
            break
          case 2:
            typeName = 'Cancelled'
            typeClass = 'text-[#898989] b b-solid b-[#898989]'
            break
        }

        return (
          <span className={cn(
            'text-center py-1 px-2 rounded-md',
            typeClass
          )}
          >
            {typeName}
          </span>
        )
      }
    },
    {
      title: '',
      render(_, record) {
        return record.status === 0 && (
          <div>
            <Button
              size="large"
              className="w-1/2 bg-transparent! text-white!"
              loading={cancellingId === record.id}
              onClick={() => cancelTransaction(record.id)}
            >
              Cancel
            </Button>
          </div>
        )
      }
    }
  ]

  function handleSearch(value: string) {
    setKeyword(value)
  }

  async function cancelTransaction(orderId: number) {
    if (!orderId)
      return

    try {
      setCancellingId(orderId)
      await cancelTransactionApi({
        order_id: `${orderId}`
      })
    }
    finally {
      setCancellingId(0)
      refetch()
    }
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

        <SelectComponent
          size="large"
          placeholder={<div>{t('profile.transaction_status.asset_type')}</div>}
          className={cn(
            'b b-solid b-white rounded-xl of-hidden',
            '[&_.ant-select-selector]:(bg-transparent! text-white!)',
            '[&_.ant-select-selection-placeholder]:(text-[#898989]!)',
            '[&_.ant-select-selection-item]:(bg-transparent! text-white!)',
            '[&_.ant-select-arrow]:(text-white!)'
          )}
          options={assetTypeOptions}
          allowClear
        />
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
