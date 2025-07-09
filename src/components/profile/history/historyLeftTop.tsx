function HistoryLeftTop() {
  const { t } = useTranslation()
  const [carList] = useState([
    {
      title: 'profile.history.totalTransactions',
      field: '¥ 123,456',
      fieldTwo: '12.5%',
      picture: new URL('@/assets/icons/arrow-up.png', import.meta.url).href,
      color: '#2bb480'
    },

    {
      title: 'profile.history.transactionCount',
      field: '89',
      fieldTwo: '8.3%',
      picture: new URL('@/assets/icons/arrow-up.png', import.meta.url).href,
      color: '#2bb480'
    },

    {
      title: 'profile.history.transactionVolume',
      field: '¥ 1,387',
      fieldTwo: '8.3%',
      picture: new URL('@/assets/icons/arrow-up.png', import.meta.url).href,
      color: '#2bb480'
    },

    {
      title: 'profile.history.successRate',
      field: '98.2%',
      fieldTwo: '1.5%',
      picture: new URL('@/assets/icons/arrow-up.png', import.meta.url).href,
      color: '#2bb480'
    }
  ])

  return (
    <div>
      <div className="grid grid-cols-2 mt-4 gap-3">
        {
          carList.map(item => (
            <div key={item.title} className="rounded-2 bg-[#242933] p-4">
              <div className="text-[#8d909a]">{t(item.title)}</div>
              <div className="text-4">{item.field}</div>
              <div className="box-item flex items-center justify-start">
                {item.picture && (
                  <img src={item.picture} alt="" className="h-3 w-3" />
                )}
                <span style={{ color: item.color }}>{item.fieldTwo}</span>
              </div>
            </div>
          ))
        }
      </div>
      <div className="mt-4 text-[#8d909a]">{t('profile.history.view_detailed')}</div>
    </div>
  )
}

export default HistoryLeftTop
