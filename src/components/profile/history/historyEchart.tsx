import { getChartIncomeTrend } from '@/api/profile'
import { useQuery } from '@tanstack/react-query'
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export const HistoryEchart: FC<{ type: string }> = ({ type }) => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['getCchartIncomeTrend', type],
    queryFn: async () => {
      const res = await getChartIncomeTrend({
        type
      })
      return res.data
    }
  })

  useEffect(() => {
    refetch()
  }, [type])

  if (isLoading) {
    return (
      <div className="h-32 fcc">
        <Waiting iconClass="size-6" />
      </div>
    )
  }

  const chartData = data?.xAxis.map((date: string, index: number) => ({
    date,
    thisMonth: data.this_month[index]?.value || 0,
    lastMonth: data.last_month[index]?.value || 0
  })) || []

  return (
    <div className="h-32">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="linear" dataKey="thisMonth" stroke="#f0b90b" name="This Month" />
          <Line type="linear" dataKey="lastMonth" stroke="#82ca9d" name="Last Month" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
