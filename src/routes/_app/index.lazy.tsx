import { createLazyFileRoute, useRouter } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_app/')({
  component: RouteComponent
})

function RouteComponent() {
  const router = useRouter()

  useEffect(() => {
    router.navigate({
      to: '/home'
    })
  }, [])

  return (
    <div className="h-128 fcc">
      <div className="i-eos-icons-loading size-10"></div>
    </div>
  )
}
