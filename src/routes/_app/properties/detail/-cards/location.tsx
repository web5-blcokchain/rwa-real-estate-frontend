import { TitleCard } from '@/components/common/title-card'

export const LocationCard: FC = () => {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(true)

  return (
    <TitleCard title={t('properties.detail.location')}>
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
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3237.5745135709676!2d139.85366567516797!3d35.761261425574546!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6018857e4b9f72e7%3A0x208db05c46698b2d!2z44CSMTI1LTAwNTEgVG9reW8sIEthdHN1c2hpa2EgQ2l0eSwgTmlpanVrdSwgMi1jaMWNbWXiiJI14oiSOCDjg6zjgqrjg5Hjg6zjgrnjgqLjgqTjg6rjgrk!5e0!3m2!1szh-CN!2sjp!4v1741745705681!5m2!1szh-CN!2sjp"
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

        <ul className="list-none [&>li]:(pl-4)">
          <li>500m from subway station</li>
          <li>3 minutes walk to bus stop</li>
          <li>3 major supermarkets nearby</li>
          <li>General hospital within 1km</li>
        </ul>
      </div>
    </TitleCard>
  )
}
