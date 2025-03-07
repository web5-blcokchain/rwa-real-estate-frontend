'use client'

import { useState } from 'react'
import { Waiting } from '../common/waiting'

const RealEstateCard: FC<{
  picture: string
  title: string
  location: string
  price: number
  tokenPrice: number
  size: string
  beds: number
  status: number
}> = ({
  picture,
  title,
  location,
  price,
  tokenPrice,
  size,
  beds,
  status
}) => {
  const [loading, setLoading] = useState(true)

  return (
    <div className="overflow-hidden rounded-xl bg-background-secondary">
      <div className="h-56">
        {
          loading
            ? (
                <div className="size-full flex items-center justify-center">
                  <Waiting iconClass="size-8" />
                </div>
              )
            : (
                null
              )
        }
        <img
          src={picture}
          className="size-full object-cover"
          onLoad={() => {
            setLoading(false)
          }}
        />
      </div>
      <div className="px-6 py-8 space-y-2">
        <div className="fbc text-5">
          <div>
            $
            {price}
            M
          </div>

          <div className="rounded bg-[#8465bb] bg-opacity-50 px-2 py-1 text-3 text-purple">
            status
            {status}
          </div>
        </div>

        <div className="fbc">
          <div className="text-4">
            {`Token Price: ${tokenPrice}`}
          </div>
        </div>

        <div className="text-4 font-medium">{title}</div>

        <div className="text-sm text-[#b5b5b5]">{location}</div>

        <div className="py-2">
          <div className="h-1px bg-white"></div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div>
            {`${beds} Beds`}
          </div>
          <div>
            {size}
          </div>
          <div>
            2 Years Old
          </div>
        </div>
      </div>
    </div>
  )
}

export default RealEstateCard
