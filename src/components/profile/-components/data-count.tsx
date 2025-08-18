import { getOverView } from '@/api/profile'
import { useCommonDataStore } from '@/stores/common-data'
import { useQuery } from '@tanstack/react-query'
import numbro from 'numbro'
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
  const commonData = useCommonDataStore()

  const isUpIcon = (data: any) => {
    if (data) {
      return new URL('@/assets/icons/arrow-up.png', import.meta.url).href
    }
    return ''
  }

  const updateData = () => [
    {
      title: 'profile.data_count.totalAssetValue',
      field: `${numbro(_get(data, 'total_current', '0.00')).format({
        thousandSeparated: true,
        mantissa: 2,
        trimMantissa: true
      })} ${commonData.payTokenName}`,
      fieldTwo: { content: '', value: `${_get(data, 'total_current_growth', '0.00')}%` },
      picture: isUpIcon(_get(data, 'total_number_vs_last_month', false)),
      color: _get(data, 'total_number_vs_last_month', false) ? '#2bb480' : '8d909a'
    },

    {
      title: 'profile.data_count.expectedIncomeThisMonth',
      field: `${numbro(_get(data, 'monthly_rental_income', '0.00')).format({
        thousandSeparated: true,
        mantissa: 2,
        trimMantissa: true
      })} ${commonData.payTokenName}`,
      fieldTwo: { content: '', value: `${_get(data, 'monthly_rental_income_growth', '0.00')}%` },
      picture: isUpIcon(_get(data, 'current_month_income', false)),
      color: _get(data, 'monthly_rental_income_vs_last_month', false) ? '#2bb480' : '8d909a'
    },

    {
      title: 'profile.data_count.averageMonthlyIncome',
      field: `${numbro(_get(data, 'monthly_rental_income', '0.00')).format({
        thousandSeparated: true,
        mantissa: 2,
        trimMantissa: true
      })} ${commonData.payTokenName}`,
      fieldTwo: { content: 'profile.data_count.vsLastMonth', value: `$${_get(data, 'monthly_rental_income_growth', '0.00')}%` },
      picture: isUpIcon(_get(data, 'monthly_rental_income_vs_last_month', false)),
      color: _get(data, 'monthly_rental_income_vs_last_month', false) ? '#2bb480' : '8d909a'
    },

    {
      title: 'profile.data_count.yieldPerformance',
      field: `${_get(data, 'annual_yield', '0.00')}%`,
      fieldTwo: { content: 'profile.data_count.industryAverage', value: `$${_get(data, 'annual_yield_growth', '0.00')}%` },
      picture: isUpIcon(_get(data, 'annual_yield_vs_last_month', false)),
      color: _get(data, 'annual_yield_vs_last_month', false) ? '#2bb480' : '8d909a'
    }
  ]

  const [list, setList] = useState(updateData())

  useEffect(() => {
    if (data) {
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
              {/* <div className="flex items-center justify-start">
                {item.picture && (
                  <img src={item.picture} alt="" className="h-3 w-3" />
                )}
                <span style={{ color: item.color }}>{t(item.fieldTwo.content) + item.fieldTwo.value}</span>
              </div> */}
            </div>
          ))}
        </div>
      </Waiting>
    </div>
  )
}

export default DataCount
