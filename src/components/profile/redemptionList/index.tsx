import { formatNumberNoRound } from '@/utils/number'
import { Button } from 'antd'
import dayjs from 'dayjs'

export default function RedemptionList() {
  const { t } = useTranslation('', {
    keyPrefix: 'profile.redemptionList'
  })
  const redemptionList = [
    {
      id: 1,
      name: 'AT20230815-075',
      address: '上海市浦东新区世纪大道100号楼盐城市射阳县经济开发区滨湖公寓22号楼',
      status: 1,
      lastPay: '2025-01-01',
      nextPay: '2025-01-01',
      amount: 10000,
      buyAmount: 10000,
      hash: '1234567890',
      incomeTime: '2025-09-15'
    },
    {
      id: 2,
      name: 'AT20230815-0752',
      address: '上海市浦东新区世纪大道100号',
      status: 0,
      lastPay: '2025-01-01',
      nextPay: '2025-01-01',
      amount: 10000,
      buyAmount: 10000,
      hash: '1234567890',
      incomeTime: '2025-09-15'
    },
    {
      id: 3,
      name: 'AT20230815-0753',
      address: '上海市浦东新区世纪大道100号',
      status: 1,
      lastPay: '2025-01-01',
      nextPay: '2025-01-01',
      amount: 10000,
      buyAmount: 10000,
      hash: '',
      incomeTime: '2025-09-15'
    },
    {
      id: 4,
      name: 'AT20230815-0754',
      address: '上海市浦东新区世纪大道100号',
      status: 1,
      lastPay: '2025-01-01',
      nextPay: '2025-01-01',
      amount: 10000,
      buyAmount: 10000,
      hash: '1234567890',
      incomeTime: '2025-09-15'
    },
    {
      id: 5,
      name: 'AT20230815-0755',
      address: '上海市浦东新区世纪大道100号',
      status: 1,
      lastPay: '2025-01-01',
      nextPay: '2025-01-01',
      amount: 10000,
      buyAmount: 10000,
      hash: '1234567890',
      incomeTime: '2025-09-15'
    }
  ]
  const statusText = ['processing', 'completed']

  return (
    <div className="text-white [&>div:last-child]:b-0 [&>div]:b-b-1 [&>div]:b-#242933 [&>div]:pb-30px">
      {
        redemptionList.map((item) => {
          return (
            <div key={item.id} className="mt-3">
              <div className="overflow-hidden">
                <div className="truncate text-xl max-md:text-base" title={item.name}>{item.name}</div>
                <div className="truncate text-2xl max-md:text-xl" title={item.address}>{item.address}</div>
              </div>
              <div className="scrollbar-hidden overflow-hidden overflow-x-scroll">
                <div className="grid grid-cols-6 mt-8 w-full gap-2 [&>div>div]:w-max max-md:w-max max-md:flex [&>div>div:first-child]:text-base [&>div>div:last-child]:text-xl [&>div>div:first-child]:text-#898989 [&>div>div:first-child]:max-md:text-sm [&>div>div:last-child]:max-md:text-base">
                  <div>
                    <div>{t('investment_amount')}</div>
                    <div>
                      $
                      {formatNumberNoRound(item.amount)}
                    </div>
                  </div>
                  <div>
                    <div>{t('redemption_income')}</div>
                    <div>
                      $
                      {formatNumberNoRound(item.buyAmount)}
                    </div>
                  </div>
                  <div>
                    <div>{t('redemption_date')}</div>
                    <div>{dayjs(item.lastPay).format('YYYY-MM-DD')}</div>
                  </div>
                  <div>
                    <div>{t('transaction_hash')}</div>
                    <div title={item.hash}>{item.hash ? (`${item.hash.slice(0, 4)}...${item.hash.slice(-4)}`) : ''}</div>
                  </div>
                  <div>
                    <div>{t('income_date')}</div>
                    <div>{dayjs(item.incomeTime).format('YYYY-MM-DD')}</div>
                  </div>
                  <div className="fyc">
                    <Button className="w-fit text-black" type="primary">{t(statusText[item.status])}</Button>
                  </div>
                </div>
              </div>
            </div>
          )
        })
      }
    </div>
  )
}
