import type { historyResponse, listProps } from '@/api/apiMyInfoApi'
import type { TableProps } from 'antd'
import apiMyInfo from '@/api/apiMyInfoApi'
import button2 from '@/assets/icons/BUTTON2-2.png'
import button3 from '@/assets/icons/BUTTON3.png'
import frame115 from '@/assets/icons/Frame115.png'
import group272Icon from '@/assets/icons/group272.png'
import { useQuery } from '@tanstack/react-query'

import { Space, Spin } from 'antd'
import CarCount from '../-components/carCount'
import TableComponent from '../-components/tableComponent/tableComponent'

// 表格1配置
const columns: TableProps<listProps>['columns'] = [
  {
    title: 'Asset',
    dataIndex: 'total_purchase',
    key: 'Asset',
    render: (_, record) => (
      <>
        <div className="flex items-center justify-start">
          <img src={group272Icon} alt="" className="mr-2 h-6 w-6" />
          <div className="flex flex-col justify-start">
            <div>{record.address}</div>
            <div className="text-[#8d909a]">{record.property_type}</div>
          </div>
        </div>
      </>
    )
  },
  {
    title: 'Amount',
    dataIndex: 'purchase_price',
    key: 'Amount',
    render: text => <a>{text}</a>
  },
  {
    title: 'Value (JPY)',
    dataIndex: 'purchase_price',
    key: 'JPY'
  },
  {
    title: 'Share',
    dataIndex: 'number',
    key: 'Share'
  },
  {
    title: '24h Change',
    dataIndex: 'expected_annual_return',
    key: 'Change'
  },
  {
    title: 'Action',
    key: 'action',
    render: () => (
      <Space size="middle">
        <img src={button3} alt="" className="mr-2 h-6 w-8" />
        <img src={button2} alt="" className="mr-2 h-6 w-8" />
      </Space>
    )
  }
]

// 表格2配置
const columnsTwo: TableProps<historyResponse>['columns'] = [
  {
    title: 'Time',
    dataIndex: 'income_date',
    key: 'Time'
  },
  {
    title: 'Type',
    dataIndex: 'type',
    key: 'Type',
    render: text => <a>{text}</a>
  },
  {
    title: 'Asset',
    dataIndex: 'Asset',
    key: 'Asset',
    render: (_, record) => (
      <>
        <div className="flex items-center justify-start">
          <div className="flex flex-col justify-start">
            <div>{record.address}</div>
            <div className="text-[#8d909a]">TKYT</div>
          </div>
        </div>
      </>
    )
  },
  {
    title: 'Amount (JPY)',
    key: 'AmountJPY',
    dataIndex: 'number',
    render: (_, record) => (
      <>
        <div className="flex items-center justify-start">
          <div className="flex flex-col justify-start">
            <div>{record.number}</div>
            <div className="text-[#8d909a]">≈ 25.4 TKYT</div>
          </div>
        </div>
      </>
    )
  },
  {
    title: 'Status',
    key: 'Status',
    render: () => (
      <Space size="middle">
        <img src={frame115} alt="" className="img-frame115" />
      </Space>
    )
  }
]

function Overview() {
  // const [keyword, setKeyword] = useState<string>('')
  // const [page, setPage] = useState<number>(1)
  // const [pageSize, setPageSize] = useState<number>(20)

  const { data: overviewData, isLoading } = useQuery({
    queryKey: ['overview'],
    queryFn: async () => {
      const res = await apiMyInfo.getMeInfo({})
      return res.data?.list
    }
  })

  const { data: historyData, isLoading: historyLoading } = useQuery({
    queryKey: ['history'],
    queryFn: async () => {
      const res = await apiMyInfo.getHistory()
      return res.data?.list || []
    }
  })

  if (isLoading || historyLoading) {
    return (
      <div className="w-full p-8 h-dvh">
        <Spin />
      </div>
    )
  }

  return (
    <div>
      <CarCount />
      <TableComponent
        columns={columns}
        data={overviewData || []}
      >
        <div className="mb-2 text-5">Token Holdings</div>
      </TableComponent>

      <TableComponent<historyResponse>
        columns={columnsTwo}
        data={historyData || []}
      >
        <div className="mb-2 text-5">Earnings History</div>
      </TableComponent>
    </div>
  )
}

export default Overview
