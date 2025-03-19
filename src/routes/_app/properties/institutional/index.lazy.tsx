import { RealEstateCard } from '@/components/common/real-estate-card'
import { createLazyFileRoute } from '@tanstack/react-router'
import { AssetValueTrends } from './-components/asset-value-trends'
import { FilterCard } from './-components/filter-card'
import { FunctionCard } from './-components/function-card'
import { YieldDistribution } from './-components/yield-distribution'

export const Route = createLazyFileRoute('/_app/properties/institutional/')({
  component: RouteComponent
})

function RouteComponent() {
  const functionCards = [
    {
      icon: 'download-file',
      title: 'Investment Report Download',
      description: 'Get detailed investment analysis reports and market research data',
      buttonText: 'Download Report',
      buttonClick: () => console.log('Download Report')
    },
    {
      icon: 'calendar',
      title: 'Book Consultation',
      description: 'One-on-one consultation with our investment advisors',
      buttonText: 'Book Now',
      buttonClick: () => console.log('Book Now')
    },
    {
      icon: 'analysis',
      title: 'Custom Analysis',
      description: 'Create personalized investment portfolio analysis reports',
      buttonText: 'Start Analysis',
      buttonClick: () => console.log('Start Analysis')
    }
  ]

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

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <AssetValueTrends />
        <YieldDistribution />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 md:grid-cols-2">
        {
          functionCards.map(
            (card, index) => (
              <FunctionCard key={index} {...card} />
            )
          )
        }
      </div>
    </div>
  )
}
