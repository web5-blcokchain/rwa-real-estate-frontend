import { createLazyFileRoute } from '@tanstack/react-router'
import { FilterCard } from './-components/filter-card'

export const Route = createLazyFileRoute('/_app/properties/institutional/')({
  component: RouteComponent
})

function RouteComponent() {
  return (
    <div className="p-8 space-y-8">
      <div className="text-8">Institutional Real Estate Investment</div>

      <div className="max-w-xl text-4">
        Premium institutional-grade real estate investment opportunities enabled by blockchain technology
      </div>

      <FilterCard />
    </div>
  )
}
