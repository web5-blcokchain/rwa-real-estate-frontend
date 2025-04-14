import basicApi from '@/api/basicApi'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const CollectButton: FC<{
  houseId: number
  collect: 0 | 1
  queryKey?: string[]
} & React.HTMLAttributes<HTMLDivElement>> = ({
  houseId,
  collect,
  queryKey,
  className
}) => {
  const queryClient = useQueryClient()
  const [defaultValue, setDefaultValue] = useState(collect)

  const {
    mutateAsync: collectMutate,
    isPending: collectIsPending
  } = useMutation({
    mutationFn: async () => {
      const res = await basicApi.setCollect({ id: `${houseId}` })
      if (queryKey) {
        await queryClient.refetchQueries({ queryKey })
      }
      return res.data
    }
  })
  const {
    mutateAsync: unCollectMutate,
    isPending: unCollectIsPending
  } = useMutation({
    mutationFn: async () => {
      const res = await basicApi.setUnCollect({ id: `${houseId}` })
      if (queryKey) {
        await queryClient.refetchQueries({ queryKey })
      }
      return res.data
    }
  })

  const isLoading = (queryKey && queryClient.isFetching({ queryKey }) > 0) || collectIsPending || unCollectIsPending

  return (
    <div
      className={cn(
        'size-8 rounded-full',
        'flex items-center justify-center',
        'clickable',
        className,
        defaultValue ? 'bg-white' : 'bg-primary'
      )}
    >
      <Waiting
        for={!isLoading}
        iconClass={cn(
          defaultValue ? 'bg-black' : 'bg-white'
        )}
      >
        <div
          className={cn(
            'size-5',
            defaultValue
              ? 'i-material-symbols-check-rounded bg-gray'
              : 'i-ic-round-favorite-border text-white'
          )}
          onClick={async (e) => {
            e.stopPropagation()
            e.preventDefault()

            if (isLoading) {
              return
            }

            if (defaultValue) {
              await unCollectMutate()
            }
            else {
              await collectMutate()
            }

            setDefaultValue(defaultValue ? 0 : 1)
          }}
        >
        </div>
      </Waiting>
    </div>
  )
}
