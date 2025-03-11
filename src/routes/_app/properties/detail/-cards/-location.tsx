import { DetailCard } from './-card'

export const LocationCard: FC = () => {
  return (
    <DetailCard title="Location">
      <div className="text-4 space-y-4">
        <div className="h-32 fcc rounded-xl bg-background">
          <div>TODO: Google map</div>
        </div>

        <ul className="list-none [&>li]:(pl-4)">
          <li>500m from subway station</li>
          <li>3 minutes walk to bus stop</li>
          <li>3 major supermarkets nearby</li>
          <li>General hospital within 1km</li>
        </ul>
      </div>
    </DetailCard>
  )
}
