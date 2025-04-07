import type { TableProps } from 'antd'
import basicApi from '@/api/basicApi'
import TableComponent from '@/components/aboutMe/-components/tableComponent/tableComponent'
import { IImage } from '@/components/common/i-image'
import { usePrivy } from '@privy-io/react-auth'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Button } from 'antd'

export const Route = createLazyFileRoute('/_app/account/collections/')({
  component: RouteComponent
})

function RouteComponent() {
  const [keyword, setKeyword] = useState('')

  return (
    <div className="space-y-4">
      <div className="text-8 text-white">Collections</div>

      <div className="fyc flex-inline b b-white rounded-xl b-solid p-4 space-x-4">
        <div className="i-iconamoon-search size-5 bg-[#b5b5b5]"></div>
        <input
          type="text"
          placeholder="Search by New York location, property type"
          className="w-128 b-none bg-transparent outline-none"
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
        />
      </div>

      <div>
        <Table />
      </div>

      <div className="rounded-xl bg-[#1e2024] p-6">
        <div className="fbc">
          <div className="text-[#898989]">Selected: 0 project</div>
          <div className="fyc gap-2">
            <div className="text-[#898989]">Total Investment:</div>
            <div className="text-6 text-primary">¥0.00</div>
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-4">
          <Button
            size="large"
            className="rounded-xl bg-transparent! text-[#9e9e9e]!"
          >
            Clear Favorites
          </Button>

          <Button
            type="primary"
            size="large"
            className="rounded-xl bg-primary-2 text-black!"
          >
            Invest Now
          </Button>
        </div>
      </div>
    </div>
  )
}

const Table: FC = () => {
  const { ready, authenticated } = usePrivy()

  useEffect(() => {
    if (!authenticated) {
      return
    }

    basicApi
      .getCollectList()
      .then((res) => {
        console.log(res)
      })
  }, [])

  if (!ready) {
    return (
      <div className="fcc py-8">
        <Waiting iconClass="size-10" />
      </div>
    )
  }

  const columns: TableProps['columns'] = [
    {
      title: 'Investment Project',
      render: (_, item) => (
        <div className="fyc gap-8">
          <IImage
            src={item.image}
            className="h-48 w-72 rounded-md"
          />

          <div>
            <div className="text-4">{item.title}</div>
            <div className="text-3.5 text-[#8d909a]">
              Location:
              {' '}
              {item.location}
            </div>
            <div className="text-3.5 text-[#8d909a]">
              Area:
              {' '}
              {item.area}
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Expected ROI',
      align: 'center',
      render: (_, item) => (
        <div className="text-4 text-primary">
          {item.expected_roi}
        </div>
      )
    },
    {
      title: 'Investment Period',
      align: 'center',
      render: (_, item) => (
        <div className="text-4">
          {item.investment_period}
        </div>
      )
    },
    {
      title: 'Action',
      align: 'right',
      render: () => (
        <div className="fcc text-5">
          <div className="i-material-symbols-delete-forever-rounded bg-primary clickable"></div>
        </div>
      )
    }
  ]

  const data: any[] = [
    {
      title: 'Tokyo Shinjuku Luxury Apartment Investment',
      location: 'West Shinjuku, Tokyo',
      area: '80 sq.m',
      image: 'https://picsum.photos/300/200',
      expected_roi: '8%',
      investment_period: '36month'
    }
  ]

  return (
    <TableComponent
      columns={columns}
      data={data}
    >
      <div className="mb-2 text-5">
        Collection List
      </div>
    </TableComponent>
  )
}
