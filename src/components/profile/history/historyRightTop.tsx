import { getTransactions } from '@/api/transaction'
import group272Icon from '@/assets/icons/group272.png'
import { useQuery } from '@tanstack/react-query'

function HistoryRightTop({ type }: { type: string }) {
  const { data } = useQuery({
    queryKey: ['getTransactions', type],
    queryFn: async () => {
      const res = await getTransactions({
        page: 1,
        pageSize: 10,
        type
      })
      return res.data
    }
  })
  const updateData = () => {
    // data
    return [
      {
        title: 'Balance Adjustment',
        titleTwo: 'Fund Credit',
        field: '+¥100.00',
        fieldTwo: '12.5%',
        picture: new URL('@/assets/icons/arrow-up.png', import.meta.url).href,
        color: '#2bb480'
      },

      {
        title: 'Balance Adjustment',
        titleTwo: 'Fund Credit',
        field: '+¥100.00',
        fieldTwo: '8.3%',
        picture: new URL('@/assets/icons/arrow-up.png', import.meta.url).href,
        color: '#2bb480'
      },

      {
        title: 'Balance Adjustment',
        titleTwo: 'Fund Credit',
        field: '¥ 1,387',
        fieldTwo: '8.3%',
        picture: new URL('@/assets/icons/arrow-up.png', import.meta.url).href,
        color: '#2bb480'
      },

      {
        title: 'Balance Adjustment',
        titleTwo: 'Fund Credit',
        field: '+¥100.00',
        fieldTwo: '1.5%',
        picture: new URL('@/assets/icons/arrow-up.png', import.meta.url).href,
        color: '#2bb480'
      }
    ]
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
                <div className="text-[#8d909a]">TKYT</div>
              </div>
            </div>

            <div className="text-[#b5b5b5]">{item.field}</div>
          </div>
        ))
      }
    </div>
  )
}

export default HistoryRightTop
