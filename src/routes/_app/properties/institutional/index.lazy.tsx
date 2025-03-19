import { RealEstateCard } from '@/components/common/real-estate-card'
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

      <div className="grid grid-cols-1 mt-8 gap-8 lg:grid-cols-3 md:grid-cols-2">
        {
          Array.from({ length: 6 }).map((_, i) => (
            <RealEstateCard
              key={i}
              picture={`https://picsum.photos/500/300?random=${i}`}
              title="Park Avenue Tower"
              location="Upper East Side, Manhattan, New York"
              size="813 sq ft"
              beds={2}
              price={850000}
              tokenPrice={850000}
              status={0}
            />
          ))
        }
      </div>
    </div>
  )
}
