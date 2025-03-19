import { TitleCard } from '@/components/common/title-card'

export const PropertyDescriptionCard: FC = () => {
  return (
    <TitleCard title="Property Description">
      <div className="text-4 space-y-4">
        <div className="text-[#d9d9d9]">
          This Victorian detached house on Berwick Street maintains a classic British architectural style.
          The property has been carefully maintained and modernized, perfectly blending historical features with contemporary comfort.
        </div>

        <div>
          The property includes:
        </div>

        <ul className="list-disc list-inside text-[#d9d9d9] space-y-2 [&>li]:marker:text-yellow-500">
          <li>Spacious living room with large windows providing natural light</li>
          <li>Modern fully equipped open-plan kitchen</li>
          <li>Two comfortable double bedrooms</li>
          <li>Newly renovated modern bathroom</li>
          <li>Well-maintained back garden</li>
        </ul>
      </div>
    </TitleCard>
  )
}
