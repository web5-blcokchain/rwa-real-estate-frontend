import { IImage } from '@/components/common/i-image'
import { joinImagePath } from '@/utils/url'

export const MemberCard: FC<{
  photograph: string
  name: string
  position: string
  introduce: string
}> = ({
  photograph,
  name,
  position,
  introduce
}) => {
  return (
    <div className="fccc gap-2">
      <div className="mb-4">
        <IImage src={joinImagePath(photograph)} className="size-50 rounded-full" />
      </div>

      <div className="text-center text-5">{name}</div>
      <div className="text-center text-3.5 text-primary">{position}</div>
      <div className="text-center text-3.5 text-[#b5b5b5]">{introduce}</div>
    </div>
  )
}
