import type { PriceTrendResponse } from '@/api/basicApi'
import apiBasic from '@/api/basicApi'
import { useQuery } from '@tanstack/react-query'
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

interface trendDataResponse {
  name: string
  price: number
}

export const RegionalPriceTrendsCard: FC<{
  className?: string
}> = ({ className }) => {
  // const { t } = useTranslation()

  const { data: trendData = [] } = useQuery<trendDataResponse[]>({
    queryKey: ['PriceTrend'],
    queryFn: async () => {
      const response = await apiBasic.getPriceTrend()
      const arrData = response.data?.map((item: PriceTrendResponse) => {
        return {
          name: item.date,
          price: Number(item.price)
        }
      })
      return arrData || []
    }
  })

  return (
    <div className={cn('h-320px max-lg:h-280px', className)}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={trendData}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="linear" dataKey="price" stroke="#f0b90b" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
