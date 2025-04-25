import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute(
  '/_app/transaction/create-sell-order/$id',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_app/transaction/create-sell-order/$id"!</div>
}
