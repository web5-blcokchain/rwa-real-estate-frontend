import SelectComponent from '../-components/select-component'
import { TitleCard } from '../-components/titleCard'
import HistoryDecmber from './historyDecmber'
import { HistoryEchart } from './historyEchart'
import HistoryLeftTop from './historyLeftTop'

import HistoryRightTop from './historyRightTop'

function History() {
  const { t } = useTranslation()
  return (
    <div className="flex justify-start text-white">
      <div className="mr-3 w-1/2">
        <TitleCard
          title={<div>{t('profile.history.incomeRecords')}</div>}
          selectSlot={(
            <SelectComponent
              defaultValue="lucy"
              options={[
                { value: 'jack', label: <div>{t('profile.history.monthComparison')}</div> },
                { value: 'lucy', label: <div>{t('profile.history.last30Days')}</div> },
                { value: 'Yiminghe', label: <div>{t('profile.history.usernameExample')}</div> },
                { value: 'disabled', label: <div>{t('profile.history.disabledStatus')}</div>, disabled: true }
              ]}
            />
          )}
        >
          <HistoryLeftTop />
        </TitleCard>

        <TitleCard
          title={<div>{t('profile.history.incomeHistory')}</div>}
          className="mt-6"
          selectSlot={(
            <SelectComponent
              defaultValue="jack"
              options={[
                { value: 'jack', label: <div>{t('profile.history.monthComparison')}</div> },
                { value: 'lucy', label: <div>{t('profile.history.last30Days')}</div> },
                { value: 'Yiminghe', label: <div>{t('profile.history.usernameExample')}</div> },
                { value: 'disabled', label: <div>{t('profile.history.disabledStatus')}</div>, disabled: true }
              ]}
            />
          )}
        >
          <HistoryEchart />
        </TitleCard>
      </div>

      <div className="ml-3 w-1/2">
        <TitleCard
          title={<div>{t('profile.history.recentTransactions')}</div>}
          selectSlot={(
            <SelectComponent
              defaultValue="Yiminghe"
              options={[
                { value: 'jack', label: <div>{t('profile.history.monthComparison')}</div> },
                { value: 'lucy', label: <div>{t('profile.history.last30Days')}</div> },
                { value: 'Yiminghe', label: <div>{t('profile.history.usernameExample')}</div> },
                { value: 'disabled', label: <div>{t('profile.history.disabledStatus')}</div>, disabled: true }
              ]}
            />
          )}
        >
          <HistoryRightTop />
        </TitleCard>

        <TitleCard title={<div>{t('profile.history.decemberBudget')}</div>} className="mt-6">
          <HistoryDecmber />
        </TitleCard>
      </div>
    </div>
  )
}

export default History
