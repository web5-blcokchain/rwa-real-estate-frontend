import { getOverView } from '@/api/profile'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

// 卡片组件
function DataCount() {
  const { data, isLoading } = useQuery({
    queryKey: ['getOverView'],
    queryFn: async () => {
      const res = await getOverView()
      return res.data
    }
  })

  const updateData = () => [
    {
      title: 'Total Asset Value',
      field: `¥${_get(data, 'total_current', '0.00')}`,
      fieldTwo: `${_get(data, 'total_current_growth', '0.00')}%`,
      picture: new URL('@/assets/icons/arrow-up.png', import.meta.url).href,
      color: '#2bb480'
    },

    {
      title: 'Expected Income This Month',
      field: '1,245',
      fieldTwo: '≈ ¥8,526,450.00',
      picture: '',
      color: '#8d909a'
    },

    {
      title: 'Average Monthly Income (JPY)',
      field: `¥${_get(data, 'monthly_rental_income', '0.00')}`,
      fieldTwo: 'vs last month +1.2%',
      picture: new URL('@/assets/icons/arrow-up.png', import.meta.url).href,
      color: '#2bb480'
    },

    {
      title: 'Yield Performance',
      field: `${_get(data, 'annual_yield', '0.00')}%`,
      fieldTwo: 'Industry avg. 4.2%',
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
    <div className="h-32 fcc">
      <Waiting
        for={!isLoading}
        className="w-full fcc"
        iconClass="size-6 bg-white"
      >
        <div className="grid grid-cols-4 gap-4">

          { list.map(item => (
            <div key={item.title} className="flex flex-col rounded-xl bg-[#202329] p-5">
              <div className="text-[#8d909a]">{item.title}</div>
              <div className="text-5 text-white" style={{ fontWeight: 400 }}>{item.field}</div>
              <div className="flex items-center justify-start">
                {item.picture && (
                  <img src={item.picture} alt="" className="h-3 w-3" />
                )}
                <span style={{ color: item.color }}>{item.fieldTwo}</span>
              </div>
            </div>
          ))}
        </div>
      </Waiting>
    </div>
  )
}

export default DataCount
