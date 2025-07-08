import basicApi from '@/api/basicApi'
import { usePrivy } from '@privy-io/react-auth'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

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
  const { authenticated } = usePrivy()
  const { t } = useTranslation()
  // 监听外部传入的collect属性变化
  useEffect(() => {
    setDefaultValue(collect)
  }, [collect])

  const {
    mutateAsync: collectMutate,
    isPending: collectIsPending
  } = useMutation({
    mutationFn: async () => {
      const res = await basicApi.setCollect({ id: `${houseId}` })
      if (queryKey) {
        await queryClient.refetchQueries({ queryKey })
      }
      return res
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
      return res
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
            if (!authenticated) {
              toast.error(t('header.error.login_required'))
              return
            }
            if (isLoading) {
              return
            }
            let resopnse
            if (defaultValue) {
              resopnse = await unCollectMutate()
            }
            else {
              resopnse = await collectMutate()
            }
            if (resopnse.code === 200)
              setDefaultValue(defaultValue ? 0 : 1)
          }}
        >
        </div>
      </Waiting>
    </div>
  )
}
