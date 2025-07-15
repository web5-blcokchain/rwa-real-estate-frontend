import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_app/auditStatus/')({
  component: RouteComponent
})

function RouteComponent() {
  return <div>Hello "/_app/auditStatus/"!</div>
}
