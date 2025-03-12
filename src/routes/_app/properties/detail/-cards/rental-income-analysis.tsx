import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { DetailCard } from './card'

export const RentalIncomeAnalysisCard: FC = () => {
  const data = [
    { name: 'Q1', value: 40 },
    { name: 'Q2', value: 60 },
    { name: 'Q3', value: 90 },
    { name: 'Q4', value: 120 },
    { name: 'Q5', value: 100 },
    { name: 'Q6', value: 70 },
    { name: 'Q7', value: 160 },
    { name: 'Q8', value: 130 }
  ]

  return (
    <DetailCard title="Rental Income Analysis">
      <div className="h-32">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid stroke="#444" vertical={false} />
            <XAxis dataKey="name" stroke="#ccc" />
            <YAxis stroke="#ccc" domain={[0, 200]} />
            <Tooltip
              contentStyle={{ backgroundColor: '#333', border: 'none' }}
              labelStyle={{ color: '#fff' }}
              itemStyle={{ color: '#fff' }}
            />
            <Bar dataKey="value" fill="#f0b90b" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </DetailCard>
  )
}
