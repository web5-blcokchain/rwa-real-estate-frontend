import type { TableProps } from 'antd'
import { getEarningList, reciveEarnings } from '@/api/profile'
import TableComponent from '@/components/common/table-component'
import { useQuery } from '@tanstack/react-query'
import { Button, Pagination } from 'antd'
import dayjs from 'dayjs'

export const Earnings: FC = () => {
  const { t } = useTranslation()

  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [recivingId, setRecivingId] = useState<number[]>([])

  const pageSize = 20

  const { data: transactionsData, isLoading, refetch } = useQuery({
    queryKey: ['get-earning-list', page, pageSize],
    queryFn: async () => {
      const res = await getEarningList()

      setTotal(_get(res.data, 'count', 0))
      return _get(res.data, 'list', [])
    }
  })

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
      key: 'property_name',
      dataIndex: 'property_name'
    },
    {
      title: 'Amount',
      key: 'income_amount',
      dataIndex: 'income_amount'
    },
    {
      title: 'Tokens',
      key: 'number',
      dataIndex: 'number'
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      render(value) {
        let typeName
        let typeClass
        switch (value) {
          case 0:
            typeName = t('profile.earnings.available')
            typeClass = 'text-green-6 bg-[#1e4939]'
            break
          case 1:
            typeName = t('profile.earnings.received')
            typeClass = 'text-black bg-primary'
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
              loading={recivingId.includes(record.id)}
              onClick={() => recive(record.id)}
            >
              {t('profile.earnings.receive')}
            </Button>
          </div>
        )
      }
    }
  ]

  async function recive(incomeId: number) {
    if (!incomeId)
      return

    try {
      setRecivingId(prev => [...prev, incomeId])
      await reciveEarnings({
        income_id: `${incomeId}`
      })
    }
    finally {
      setRecivingId(prev => prev.filter(id => id !== incomeId))
      refetch()
    }
  }

  return (
    <div className="text-white space-y-6">
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
