import type { TableProps } from 'antd'
import { getTransactionStatus } from '@/api/transaction'
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

  const pageSize = 20

  const { data: transactionsData, isLoading } = useQuery({
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
    { label: 'All', value: 'all' },
    { label: 'Apartment', value: 'apartment' },
    { label: 'House', value: 'house' },
    { label: 'Land', value: 'land' },
    { label: 'Commercial', value: 'commercial' }
  ]

  const columns: TableProps['columns'] = [
    {
      title: 'Date',
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
      title: 'Asset',
      key: 'name',
      dataIndex: 'name'
    },
    {
      title: 'Number of Tokens',
      key: 'token_info',
      dataIndex: 'token_info'
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      render(value) {
        let typeName
        switch (value) {
          case 1:
            typeName = 'Property Investment'
            break
          case 2:
            typeName = 'Property Sell'
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
      title: '',
      render() {
        return (
          <div>
            <Button
              size="large"
              className="w-1/2 bg-transparent! text-white!"
            >
              Cancel the sale
            </Button>
          </div>
        )
      }
    }
  ]

  function handleSearch(value: string) {
    setKeyword(value)
  }

  return (
    <div className="text-white space-y-6">
      <div className="grid grid-cols-4 gap-4 rounded-xl bg-[#1e2024] p-6">
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
          placeholder="Asset Type"
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
