import type { FC } from 'react'
import { TitleCard } from '@/components/common/title-card'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface LocationCardProps {
  className?: string
  Longitude: string
  Latitude: string
}

export const LocationCard: FC<LocationCardProps> = ({ className, Longitude, Latitude }) => {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(true)

  return (
    <TitleCard className={className} title={t('properties.detail.location')}>
      <div className="text-4 space-y-4">
        <div className="h-48 fcc of-hidden rounded-xl bg-background">
          {
            loading && (
              <div>
                <Waiting />
              </div>
            )
          }
          <iframe
            src={`https://www.google.com/maps?q=${Latitude},${Longitude}&hl=zh-CN&z=15&output=embed`}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className={cn(
              'b-none',
              loading ? 'size-0' : 'size-full'
            )}
            onLoad={() => setLoading(false)}
          >
          </iframe>
        </div>

        {/* <ul className="list-none [&>li]:(pl-4)">
          <li>500m from subway station</li>
          <li>3 minutes walk to bus stop</li>
          <li>3 major supermarkets nearby</li>
          <li>General hospital within 1km</li>
        </ul> */}
      </div>
    </TitleCard>
  )
}
