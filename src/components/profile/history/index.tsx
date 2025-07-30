import SelectComponent from '../-components/select-component'
import { TitleCard } from '../-components/titleCard'
import HistoryDecmber from './historyDecmber'
import { HistoryEchart } from './historyEchart'
import HistoryLeftTop from './historyLeftTop'

import HistoryRightTop from './historyRightTop'

function History() {
  const { t, i18n } = useTranslation()
  const enMonth = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const [transactionType, setTransactionType] = useState('all')
  const [historyType, setHistoryType] = useState('week')
  const [chartType, setChartType] = useState('1')

  const month = (new Date().getMonth())
  return (
    <div className="flex justify-start text-white max-lg:flex max-lg:flex-col max-md:gap-4">
      <div className="mr-3 w-1/2 max-lg:w-full max-lg:flex max-lg:flex-col">
        <TitleCard
          title={<div>{t('profile.history.incomeRecords')}</div>}
          selectSlot={(
            <SelectComponent
              defaultValue={historyType}
              onChange={value => setHistoryType(value)}
              className="min-w-120px"
              options={[
                // { value: 'all', label: <div>{t('profile.history.all')}</div> },
                { value: 'week', label: <div>{t('profile.history.week')}</div> },
                { value: 'month', label: <div>{t('profile.history.month')}</div> },
                { value: 'halfYear', label: <div>{t('profile.history.halfYear')}</div> },
                { value: 'year', label: <div>{t('profile.history.year')}</div> }
              ]}
            />
          )}
        >
          <HistoryLeftTop type={historyType} />
        </TitleCard>

        <TitleCard
          title={<div>{t('profile.history.incomeHistory')}</div>}
          className="mt-6"
          selectSlot={(
            <SelectComponent
              defaultValue={chartType}
              onChange={value => setChartType(value)}
              className="min-w-120px"
              options={[
                { value: '1', label: <div>{t('profile.history.lastMonth_vs_thisMonth')}</div> },
                { value: '2', label: <div>{t('profile.history.lastYear_vs_thisYear')}</div> }
              ]}
            />
          )}
        >
          <HistoryEchart type={chartType} />
        </TitleCard>
      </div>

      <div className="ml-3 w-1/2 max-lg:ml-0 max-lg:mt-5 max-lg:w-full max-lg:flex max-lg:flex-col">
        <TitleCard
          title={<div>{t('profile.history.recentTransactions')}</div>}
          selectSlot={(
            <SelectComponent
              defaultValue={transactionType}
              onChange={value => setTransactionType(value)}
              className="min-w-120px"
              options={[
                { value: 'all', label: <div>{t('profile.history.all')}</div> },
                { value: 'week', label: <div>{t('profile.history.week')}</div> },
                { value: 'month', label: <div>{t('profile.history.month')}</div> },
                { value: 'halfYear', label: <div>{t('profile.history.halfYear')}</div> },
                { value: 'year', label: <div>{t('profile.history.year')}</div> }
              ]}
            />
          )}
        >
          <HistoryRightTop type={transactionType} />
        </TitleCard>

        <TitleCard title={<div>{t('profile.history.decemberBudget', { month: i18n.language === 'en' ? enMonth[month] : `${month + 1}月` })}</div>} className="mt-6">
          <HistoryDecmber />
        </TitleCard>
      </div>
    </div>
  )
}

export default History
