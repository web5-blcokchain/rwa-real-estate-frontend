import basicApi from '@/api/basicApi'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const CollectButton: FC<{
  houseId: number
  collect: 0 | 1
} & React.HTMLAttributes<HTMLDivElement>> = ({
  houseId,
  collect
}) => {
  const queryClient = useQueryClient()

  const {
    mutate: collectMutate,
    isPending: collectIsPending
  } = useMutation({
    mutationFn: async () => {
      const res = await basicApi.setCollect({ id: houseId })
      queryClient.invalidateQueries({ queryKey: ['properties'] })
      return res.data
    }
  })
  const {
    mutate: unCollectMutate,
    isPending: unCollectIsPending
  } = useMutation({
    mutationFn: async () => {
      const res = await basicApi.setUnCollect({ id: houseId })
      queryClient.invalidateQueries({ queryKey: ['properties'] })
      return res.data
    }
  })

  return (
    <div
      className={cn(
        'absolute right-4 top-4 size-8 rounded-full',
        'flex items-center justify-center',
        'clickable',
        collect ? 'bg-white' : 'bg-primary'
      )}
    >
      <Waiting
        for={!(queryClient.isFetching({ queryKey: ['properties'] }) || collectIsPending || unCollectIsPending)}
        iconClass={cn(
          collect ? 'bg-black' : 'bg-white'
        )}
      >
        <div
          className={cn(
            'size-5',
            collect
              ? 'i-material-symbols-check-rounded bg-gray'
              : 'i-ic-round-favorite-border text-white'
          )}
          onClick={(e) => {
            e.stopPropagation()
            e.preventDefault()

            if (queryClient.isFetching({ queryKey: ['properties'] }) || collectIsPending || unCollectIsPending) {
              return
            }

            if (collect) {
              unCollectMutate()
            }
            else {
              collectMutate()
            }
          }}
        >
        </div>
      </Waiting>
    </div>
  )
}
