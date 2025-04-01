import type { analysisResponse } from '@/api/basicApi'
import apiBasic from '@/api/basicApi'
import { TitleCard } from '@/components/common/title-card'
import { useQuery } from '@tanstack/react-query'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

interface BarDataResponse {
  name: string
  value: number
}

export const RentalIncomeAnalysisCard: FC = () => {
  const { data: BarData = [] } = useQuery<BarDataResponse[]>({
    queryKey: ['Analysis'],
    queryFn: async () => {
      const response = await apiBasic.getCostAnalysis()
      const arrData = response.data?.map((item: analysisResponse) => {
        return {
          name: item.quarter,
          value: Number(item.cost)
        }
      })
      return arrData || []
    }
  })

  return (
    <TitleCard title="Rental Income Analysis">
      <div className="h-32">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={BarData}
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
    </TitleCard>
  )
}
