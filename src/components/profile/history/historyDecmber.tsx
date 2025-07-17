import { Progress } from 'antd'

function HistoryDecmber() {
  const { t } = useTranslation()
  const list = [
    {
      title: 'profile.history.income',
      amount: { content: 'profile.history.received', value: '$0' },
      percent: 0,
      total: { content: 'profile.history.budget', value: '$170' }
    },

    {
      title: 'profile.history.expenses',
      amount: { content: 'profile.history.spent', value: '$10' },
      percent: 20,
      total: { content: 'profile.history.budget', value: '$90' }
    }
  ]

  return (
    <div>
      {
        list.map(item => (
          <div key={item.title} className="mb-6 flex flex-col">
            <div className="flex justify-between text-[#8d909a]">
              <div>{t(item.title)}</div>
              <div>{`${item.amount.value} ${t(item.amount.content)}`}</div>
            </div>
            <div>
              <Progress percent={item.percent} status="active" showInfo={false} strokeColor="#b5b5b5" trailColor="#fff" />
            </div>
            <div className="text-right text-[#8d909a]">{`${t(item.total.content)} ${item.total.value}`}</div>
          </div>
        ))
      }
    </div>
  )
}

export default HistoryDecmber
