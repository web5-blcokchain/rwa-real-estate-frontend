import type { PriceTrendResponse } from '@/api/basicApi'
import { TitleCard } from '@/components/common/title-card'
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

interface RegionalPriceTrendsCardProps {
  data: Array<PriceTrendResponse>
}

export const RegionalPriceTrendsCard: FC<RegionalPriceTrendsCardProps> = ({ data }) => {
  const arrData = data?.map((item) => {
    return {
      name: item.date,
      price: Number(item.price)
    }
  })

  return (
    <TitleCard title="Regional Price Trends">
      <div className="h-32">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={arrData}
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
    </TitleCard>
  )
}
