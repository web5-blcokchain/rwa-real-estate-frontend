import type { TableProps } from 'antd'
import apiMyInfo from '@/api/apiMyInfoApi'
import button2 from '@/assets/icons/BUTTON2-2.png'
import button3 from '@/assets/icons/BUTTON3.png'
import frame115 from '@/assets/icons/Frame115.png'
import group272Icon from '@/assets/icons/group272.png'
import { useQuery } from '@tanstack/react-query'
import { Space } from 'antd'
import DataCount from '../-components/data-count'
import TableComponent from '../../common/table-component'

interface DataType {
  key: string
  Asset: string
  Amount: string
  JPY: string
  Change: string
  Share: string
}

interface DataTypeTwo {
  key: string
  Time: string
  Type: string
  Asset: string
  AmountJPY: string
  Status: string
}

// 表格1配置
const columns: TableProps<DataType>['columns'] = [
  {
    title: 'Asset',
    dataIndex: 'Asset',
    key: 'Asset',
    render: (_, record) => (
      <>
        <div className="flex items-center justify-start">
          <img src={group272Icon} alt="" className="mr-2 h-6 w-6" />
          <div className="flex flex-col justify-start">
            <div>{record.Asset}</div>
            <div className="text-[#8d909a]">TKYT</div>
          </div>
        </div>
      </>
    )
  },
  {
    title: 'Amount',
    dataIndex: 'Amount',
    key: 'Amount',
    render: text => <a>{text}</a>
  },
  {
    title: 'Value (JPY)',
    dataIndex: 'JPY',
    key: 'JPY'
  },
  {
    title: 'Share',
    key: 'Share',
    dataIndex: 'Share'
  },
  {
    title: '24h Change',
    dataIndex: 'Change',
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

const data: DataType[] = [
  {
    key: '1',
    Asset: 'Tokyo Tower Apartments RWA',
    Amount: '5,280.00',
    JPY: '¥5,280,000.00',
    Change: '+2.8%',
    Share: '42.3%'
  },
  {
    key: '2',
    Asset: 'Osaka Business Center RWA',
    Amount: '3,246.45',
    JPY: '¥3,246,450.00',
    Change: '-0.5%',
    Share: '6.1%'
  }
]

// 表格2配置
const columnsTwo: TableProps<DataType>['columns'] = [
  {
    title: 'Time',
    dataIndex: 'Time',
    key: 'Time'
  },
  {
    title: 'Type',
    dataIndex: 'Type',
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
            <div>{record.Asset}</div>
            <div className="text-[#8d909a]">TKYT</div>
          </div>
        </div>
      </>
    )
  },
  {
    title: 'Amount (JPY)',
    key: 'AmountJPY',
    dataIndex: 'AmountJPY',
    render: (_, record) => (
      <>
        <div className="flex items-center justify-start">
          <div className="flex flex-col justify-start">
            <div>{record.AmountJPY}</div>
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

const dataTwo: DataTypeTwo[] = [
  {
    key: '1',
    Time: '2024-12-15 15:30',
    Type: 'Rental Distribution',
    Asset: 'Tokyo Tower Apartments RWA',
    AmountJPY: '¥25,400.00',
    Status: '42.3%'
  },
  {
    key: '2',
    Time: '2024-12-15 15:30',
    Type: 'Rental Distribution',
    Asset: 'Tokyo Tower Apartments RWA',
    AmountJPY: '¥25,400.00',
    Status: '42.3%'
  }
]

function Earnings() {
  const { data: EarningsData = [], isLoading } = useQuery({
    queryKey: ['Earnings'],
    queryFn: async () => {
      const res = await apiMyInfo.getEarningsHistory()
      return res.data?.list || []
    }
  })
  console.log('=-=-=-', EarningsData, isLoading)

  return (
    <div>
      <DataCount />
      <TableComponent
        columns={columns}
        data={data}
      >
        <div className="mb-2 text-5">Income Composition</div>
      </TableComponent>

      <TableComponent
        columns={columnsTwo}
        data={dataTwo || []}
      >
        <div className="mb-2 text-5">Historical Income Records</div>
      </TableComponent>
    </div>
  )
}

export default Earnings
