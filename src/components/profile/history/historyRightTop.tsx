import { getTransactions } from '@/api/transaction'
import group272Icon from '@/assets/icons/group272.png'
import { useQuery } from '@tanstack/react-query'
import numbro from 'numbro'

function HistoryRightTop({ type }: { type: string }) {
  const { t } = useTranslation()
  const { data } = useQuery({
    queryKey: ['getTransactions', type],
    queryFn: async () => {
      const res = await getTransactions({
        page: 1,
        pageSize: 10,
        type
      })
      console.log(res.data)

      return res.data
    }
  })
  // 交易类型 1为资产投资 Primary Subscription 2.赎回Asset Redemption 3为二级市场出售 Secondary Market Disposition 4为二级市场购买Secondary Market Acquisition
  const typeList = ['primary_subscription', 'asset_redemption', 'secondary_market_disposition', 'secondary_market_acquisition']
  const updateData = () => {
    return data?.list?.map((item) => {
      return {
        title: item.name,
        titleTwo: t(`profile.history.${typeList[item.type]}`),
        field: `${[2, 3].includes(item.type) ? '+' : '-'}$${numbro(item.total_money).format({
          thousandSeparated: true,
          mantissa: 2
        })}`,
        picture: new URL('@/assets/icons/arrow-up.png', import.meta.url).href,
        color: '#2bb480'
      }
    }) || []
  }

  const [list, setList] = useState(updateData())

  useEffect(() => {
    if (data) {
      setList(updateData())
    }
  }, [data])

  return (
    <div>
      {
        list.map(item => (
          <div key={item.title} className="flex justify-between">
            <div className="mb-4 flex items-center justify-start">
              <img src={group272Icon} alt="" className="mr-2 h-6 w-6" />
              <div className="flex flex-col justify-start">
                <div>{item.title}</div>
                <div className="text-[#8d909a]">{item.titleTwo}</div>
              </div>
            </div>

            <div className="text-[#b5b5b5]">{item.field}</div>
          </div>
        ))
      }
      {
        list.length === 0 && <div className="text-center text-4 text-white">{t('common.no_data')}</div>
      }
    </div>
  )
}

export default HistoryRightTop
