import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { DetailCard } from './card'

export const RegionalPriceTrendsCard: FC = () => {
  const data = [
    {
      name: '09-01',
      price: 0
    },
    {
      name: '09-02',
      price: 21
    },
    {
      name: '09-03',
      price: 0
    },
    {
      name: '09-04',
      price: 32
    },
    {
      name: '09-05',
      price: 20
    },
    {
      name: '09-06',
      price: 24
    },
    {
      name: '09-07',
      price: 50
    }
  ]

  return (
    <DetailCard title="Regional Price Trends">
      <div className="h-32">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="price" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </DetailCard>
  )
}
