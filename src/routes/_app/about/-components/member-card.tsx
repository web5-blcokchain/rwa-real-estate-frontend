export const MemberCard: FC<{
  picture: string
  name: string
  title: string
  desc: string
}> = ({
  picture,
  name,
  title,
  desc
}) => {
  return (
    <div className="fccc gap-2">
      <div className="mb-4">
        <img src={picture} className="size-50 rounded-full" />
      </div>

      <div className="text-center text-5">{name}</div>
      <div className="text-center text-3.5 text-primary">{title}</div>
      <div className="text-center text-3.5 text-[#b5b5b5]">{desc}</div>
    </div>
  )
}
