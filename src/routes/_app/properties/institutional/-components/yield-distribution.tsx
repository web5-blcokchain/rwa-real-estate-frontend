import { TitleCard } from '@/components/common/title-card'
import { Pie, PieChart, ResponsiveContainer } from 'recharts'

export const YieldDistribution: FC = () => {
  const data = [
    {
      name: 'A',
      value: 400
    },
    {
      name: 'B',
      value: 300
    },
    {
      name: 'C',
      value: 300
    },
    {
      name: 'D',
      value: 200
    },
    {
      name: 'E',
      value: 278
    }
  ]

  return (
    <TitleCard title="Asset Value Trends">
      <div className="h-64 fcc">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={60} outerRadius={80} fill="#f0b90b" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </TitleCard>
  )
}
