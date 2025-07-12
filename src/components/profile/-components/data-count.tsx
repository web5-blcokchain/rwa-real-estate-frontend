import { getOverView } from '@/api/profile'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

// 卡片组件
function DataCount() {
  const { t } = useTranslation()
  const { data, isLoading } = useQuery({
    queryKey: ['getOverView'],
    queryFn: async () => {
      const res = await getOverView()
      return res.data
    }
  })

  const updateData = () => [
    {
      title: 'profile.data_count.totalAssetValue',
      field: `¥${_get(data, 'total_current', '0.00')}`,
      fieldTwo: { content: '', value: `${_get(data, 'total_current_growth', '0.00')}%` },
      picture: new URL('@/assets/icons/arrow-up.png', import.meta.url).href,
      color: '#2bb480'
    },

    {
      title: 'profile.data_count.expectedIncomeThisMonth',
      field: '1,245',
      fieldTwo: { content: '', value: '≈ ¥8,526,450.00' },
      picture: '',
      color: '#8d909a'
    },

    {
      title: 'profile.data_count.averageMonthlyIncome',
      field: `¥${_get(data, 'monthly_rental_income', '0.00')}`,
      fieldTwo: { content: 'profile.data_count.vsLastMonth', value: ` +1.2%` },
      picture: new URL('@/assets/icons/arrow-up.png', import.meta.url).href,
      color: '#2bb480'
    },

    {
      title: 'profile.data_count.yieldPerformance',
      field: `${_get(data, 'annual_yield', '0.00')}%`,
      fieldTwo: { content: 'profile.data_count.industryAverage', value: ` 4.2%` },
      picture: '',
      color: '#8d909a'
    }
  ]

  const [list, setList] = useState(updateData())

  useEffect(() => {
    if (data) {
      console.log(data)
      setList(updateData())
    }
  }, [data])

  return (
    <div className="h-32 fcc max-lg:h-auto">
      <Waiting
        for={!isLoading}
        className="w-full fcc"
        iconClass="size-6 bg-white"
      >
        <div className="grid grid-cols-4 w-full gap-4 max-lg:grid-cols-2">

          { list.map(item => (
            <div key={item.title} className="flex flex-col rounded-xl bg-[#202329] p-5">
              <div className="text-[#8d909a]">{t(item.title)}</div>
              <div className="text-5 text-white" style={{ fontWeight: 400 }}>{item.field}</div>
              <div className="flex items-center justify-start">
                {item.picture && (
                  <img src={item.picture} alt="" className="h-3 w-3" />
                )}
                <span style={{ color: item.color }}>{t(item.fieldTwo.content) + item.fieldTwo.value}</span>
              </div>
            </div>
          ))}
        </div>
      </Waiting>
    </div>
  )
}

export default DataCount
