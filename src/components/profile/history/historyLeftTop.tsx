import { getChartIncomeStatistics } from '@/api/profile'
import { useQuery } from '@tanstack/react-query'

function HistoryLeftTop({ type }: { type: string }) {
  const { t } = useTranslation()
  const { data, isLoading } = useQuery({
    queryKey: ['getChartIncomeStatistics', type],
    queryFn: async () => {
      const data_number = {
        week: '7',
        month: '30',
        halfYear: '180',
        year: '365'
      }
      const res = await getChartIncomeStatistics({
        data_number: data_number[type as keyof typeof data_number]
      })
      return res.data
    }
  })

  const isUpIcon = (data: any) => {
    if (data) {
      return new URL('@/assets/icons/arrow-up.png', import.meta.url).href
    }
    return ''
  }

  const updateData = () => ([
    {
      title: 'profile.history.totalTransactions',
      field: `¥${_get(data, 'total_transactions.value', '0.00')}`,
      fieldTwo: `${_get(data, 'total_transactions.growth', '0')}%`,
      picture: isUpIcon(Number(_get(data, 'total_transactions.growth', 0)) > 0),
      color: Number(_get(data, 'total_transactions.growth', 0)) > 0 ? '#2bb480' : '8d909a'
    },

    {
      title: 'profile.history.transactionCount',
      field: `¥${_get(data, 'number_of_transactions.value', '0.00')}`,
      fieldTwo: `${_get(data, 'number_of_transactions.growth', '0')}%`,
      picture: isUpIcon(Number(_get(data, 'number_of_transactions.growth', 0)) > 0),
      color: Number(_get(data, 'number_of_transactions.growth', 0)) > 0 ? '#2bb480' : '8d909a'
    },

    {
      title: 'profile.history.transactionVolume',
      field: `¥${_get(data, 'average_transaction.value', '0.00')}`,
      fieldTwo: `${_get(data, 'average_transaction.growth', '0')}%`,
      picture: isUpIcon(Number(_get(data, 'average_transaction.growth', 0)) > 0),
      color: Number(_get(data, 'average_transaction.growth', 0)) > 0 ? '#2bb480' : '8d909a'
    },

    {
      title: 'profile.history.successRate',
      field: `${_get(data, 'success_rate.value', '0.00')}%`,
      fieldTwo: `${_get(data, 'success_rate.growth', '0')}%`,
      picture: isUpIcon(Number(_get(data, 'success_rate.growth', 0)) > 0),
      color: Number(_get(data, 'success_rate.growth', 0)) > 0 ? '#2bb480' : '8d909a'
    }
  ])
  const [list, setList] = useState(updateData())

  useEffect(() => {
    if (data) {
      setList(updateData())
    }
  }, [data])
  return (
    <div>
      <Waiting
        for={!isLoading}
        className="w-full fcc"
        iconClass="size-6 bg-white"
      >
        <div className="grid grid-cols-2 mt-4 gap-3">
          {
            list.map(item => (
              <div key={item.title} className="rounded-2 bg-[#242933] p-4">
                <div className="text-[#8d909a]">{t(item.title)}</div>
                <div className="text-4">{item.field}</div>
                <div className="box-item flex items-center justify-start">
                  {item.picture && (
                    <img src={item.picture} alt="" className="h-3 w-3" />
                  )}
                  <span style={{ color: item.color }}>{item.fieldTwo}</span>
                </div>
              </div>
            ))
          }
        </div>
      </Waiting>
      <div className="mt-4 text-[#8d909a]">{t('profile.history.view_detailed')}</div>
    </div>
  )
}

export default HistoryLeftTop
