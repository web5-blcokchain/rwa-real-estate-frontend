import { RealEstateCard } from '@/components/common/real-estate-card'
import { createLazyFileRoute, useNavigate } from '@tanstack/react-router'
import { Button } from 'antd'

export const Route = createLazyFileRoute('/_app/properties/')({
  component: RouteComponent
})

function RouteComponent() {
  const navigate = useNavigate()

  return (
    <div className="p-8">
      <div className="text-8 font-medium">
        US Real Estate Assets
      </div>

      <div className="mt-4 text-4 text-[#898989]">
        Premium New York real estate investment opportunities through blockchain technology
      </div>

      <div className="mt-8">
        <div className="fyc flex-inline b b-white rounded-xl b-solid p-4 space-x-4">
          <div className="i-iconamoon-search size-5 bg-[#b5b5b5]"></div>
          <input
            type="text"
            placeholder="Search by New York location, property type"
            className="w-128 b-none bg-transparent outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 mt-8 gap-8 md:grid-cols-3">
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
              onClick={() => navigate({ to: '/properties/detail' })}
            />
          ))
        }
      </div>

      <div className="mt-8 text-center">
        <Button
          type="primary"
          size="large"
          className="rounded-full! text-black!"
        >
          Load More
        </Button>
      </div>
    </div>
  )
}
