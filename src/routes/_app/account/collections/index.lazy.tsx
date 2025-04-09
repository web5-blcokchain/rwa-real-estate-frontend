import type { TableProps } from 'antd'
import basicApi from '@/api/basicApi'
import { getCollectList } from '@/api/profile'
import { IImage } from '@/components/common/i-image'
import TableComponent from '@/components/common/table-component'
import { joinImagesPath } from '@/utils/url'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Button, Popconfirm } from 'antd'

export const Route = createLazyFileRoute('/_app/account/collections/')({
  component: RouteComponent
})

function RouteComponent() {
  const [keyword, setKeyword] = useState('')
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  const { data: collectionData, isLoading } = useQuery({
    queryKey: ['collections', keyword],
    queryFn: async () => {
      const res = await getCollectList({ keyword })
      return _get(res.data, 'list', [])
    }
  })

  function removeCollectionConfirm(id: number) {
    basicApi.setUnCollect({ id }).then(() => {
      queryClient.invalidateQueries({
        queryKey: ['collections']
      })
    })
  }

  const columns: TableProps['columns'] = [
    {
      title: 'Investment Project',
      render: (_, item) => (
        <div className="fyc gap-8">
          <IImage
            src={
              _get(joinImagesPath(item.image_urls), '0', '')
            }
            className="h-48 w-72 rounded-md"
          />

          <div>
            <div className="text-4">{item.address}</div>
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
      render: (_, item) => (
        <div className="fcc text-5">
          <Popconfirm
            title={t('collection.delete_confirm_title')}
            description={t('collection.delete_confirm_content')}
            onConfirm={() => removeCollectionConfirm(item.id)}
            okText={t('system.yes')}
            cancelText={t('system.no')}
          >
            <div className="i-material-symbols-delete-forever-rounded bg-primary clickable"></div>
          </Popconfirm>
        </div>
      )
    }
  ]

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
      <Waiting for={!isLoading} className="fcc py-8" iconClass="size-10">
        <TableComponent columns={columns} data={collectionData}>
          <div className="mb-2 text-5">Collection List</div>
        </TableComponent>
      </Waiting>
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
