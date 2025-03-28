import { useNavigate } from '@tanstack/react-router'
import { Button } from 'antd'
import CarCount from '../-components/carCount'
import CarPreview from '../-components/carPreview'

function PropertyTokens() {
  const navigate = useNavigate()
  return (
    <div>
      <CarCount />

      <div className="p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="text-8 text-[#fff] font-medium">
            Tokens Held
          </div>

          <div>
            <div className="fyc flex-inline b b-white rounded-xl b-solid p-4 space-x-4">
              <div className="i-iconamoon-search size-5 bg-[#b5b5b5]"></div>
              <input
                type="text"
                placeholder="Search"
                className="w-88 b-none bg-transparent outline-none"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 mt-8 gap-8 md:grid-cols-3">
          {
            Array.from({ length: 6 }).map((_, i) => (
              <CarPreview
                key={i}
                picture={`https://picsum.photos/500/300?random=${i}`}
                title="Park Avenue Tower"
                location="Upper East Side, Manhattan, New York"
                size="813 sq ft"
                beds={2}
                price={450000}
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
    </div>
  )
}

export default PropertyTokens
