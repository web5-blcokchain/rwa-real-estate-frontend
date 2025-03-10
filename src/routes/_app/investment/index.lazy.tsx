import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_app/investment/')({
  component: RouteComponent
})

function RouteComponent() {
  return (
    <div className="font-itali text-center text-8">investment page</div>
  )
}
