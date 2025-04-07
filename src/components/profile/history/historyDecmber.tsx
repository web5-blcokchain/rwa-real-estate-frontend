import { Progress } from 'antd'

function HistoryDecmber() {
  const list = [
    {
      title: 'Income',
      amount: '¥0 Received',
      percent: 0,
      total: 'Budget ¥170'
    },

    {
      title: 'Expenses',
      amount: '¥10 Spent',
      percent: 20,
      total: 'Budget ¥90'
    }
  ]

  return (
    <div>
      {
        list.map(item => (
          <div key={item.title} className="mb-6 flex flex-col">
            <div className="flex justify-between text-[#8d909a]">
              <div>{item.title}</div>
              <div>{item.amount}</div>
            </div>
            <div>
              <Progress percent={item.percent} status="active" showInfo={false} strokeColor="#b5b5b5" trailColor="#fff" />
            </div>
            <div className="text-right text-[#8d909a]">{item.total}</div>
          </div>
        ))
      }
    </div>
  )
}

export default HistoryDecmber
