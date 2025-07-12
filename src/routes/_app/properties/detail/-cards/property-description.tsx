import { TitleCard } from '@/components/common/title-card'

export const PropertyDescriptionCard: FC<{
  location: string
} & React.HTMLAttributes<HTMLDivElement>> = ({ location, className, ...props }) => {
  const { t } = useTranslation()

  return (
    <TitleCard className={className} title={t('properties.detail.property_title')}>
      <div className="text-4 space-y-4" {...props}>
        <div className="text-[#d9d9d9]">
          {location}
        </div>

        {/* <div>
          {t('properties.detail.property_includes')}
        </div> */}

        {/* <ul className="list-disc list-inside text-[#d9d9d9] space-y-2 [&>li]:marker:text-yellow-500">
          <li>Spacious living room with large windows providing natural light</li>
          <li>Modern fully equipped open-plan kitchen</li>
          <li>Two comfortable double bedrooms</li>
          <li>Newly renovated modern bathroom</li>
          <li>Well-maintained back garden</li>
        </ul> */}
      </div>
    </TitleCard>
  )
}
