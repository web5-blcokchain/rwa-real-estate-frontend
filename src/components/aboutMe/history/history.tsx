import SelectComponent from '../-components/selectComponent/selectComponent'
import { TitleCard } from '../-components/titleCard'
import HistoryDecmber from './historyDecmber'
import { HistoryEchart } from './historyEchart'
import HistoryLeftTop from './historyLeftTop'
import HistoryRightTop from './historyRightTop'

function History() {
  return (
    <div className="flex justify-start text-white">
      <div className="mr-3 w-1/2">
        <TitleCard
          title="Historical Income Records"
          selectSlot={(
            <SelectComponent
              defaultValue="lucy"
              options={[
                { value: 'jack', label: 'This Month Vs Last Month' },
                { value: 'lucy', label: 'Last 30 Days' },
                { value: 'Yiminghe', label: 'yiminghe' },
                { value: 'disabled', label: 'Disabled', disabled: true }
              ]}
            />
          )}
        >
          <HistoryLeftTop />
        </TitleCard>

        <TitleCard
          title="Historical Income Records"
          className="mt-6"
          selectSlot={(
            <SelectComponent
              defaultValue="jack"
              options={[
                { value: 'jack', label: 'This Month Vs Last Month' },
                { value: 'lucy', label: 'Last 30 Days' },
                { value: 'Yiminghe', label: 'yiminghe' },
                { value: 'disabled', label: 'Disabled', disabled: true }
              ]}
            />
          )}
        >
          <HistoryEchart />
        </TitleCard>
      </div>

      <div className="ml-3 w-1/2">
        <TitleCard
          title="Recent Transactions"
          selectSlot={(
            <SelectComponent
              defaultValue="Yiminghe"
              options={[
                { value: 'jack', label: 'This Month Vs Last Month' },
                { value: 'lucy', label: 'Last 30 Days' },
                { value: 'Yiminghe', label: 'All Transactions' },
                { value: 'disabled', label: 'Disabled', disabled: true }
              ]}
            />
          )}
        >
          <HistoryRightTop />
        </TitleCard>

        <TitleCard title="December Budget" className="mt-6">
          <HistoryDecmber />
        </TitleCard>
      </div>
    </div>
  )
}

export default History
