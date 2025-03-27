import { TitleCard } from '../-components/titleCard'
import HistoryDecmber from './historyDecmber'
import { HistoryEchart } from './historyEchart'
import HistoryLeftTop from './historyLeftTop'
import HistoryRightTop from './historyRightTop'

function History() {
  return (
    <div className="flex justify-start text-white">
      <div className="mr-3 w-1/2">
        <TitleCard title="Historical Income Records">
          <HistoryLeftTop />
        </TitleCard>

        <TitleCard title="Historical Income Records" className="mt-6">
          <HistoryEchart />
        </TitleCard>
      </div>

      <div className="ml-3 w-1/2">
        <TitleCard title="Recent Transactions">
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
