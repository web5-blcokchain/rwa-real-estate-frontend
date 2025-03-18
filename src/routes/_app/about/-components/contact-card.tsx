export const ContactCard: FC<{
  icon: string
  title: string
  desc: string[]
}> = ({
  icon,
  title,
  desc
}) => {
  return (
    <div className="fccc gap-6 text-center">
      <div className="size-16 fcc rounded-full bg-[#22252c]">
        <SvgIcon name={icon} className="size-6 text-primary-2" />
      </div>

      <div className="text-5 font-medium">{title}</div>
      <div className="text-3.5 text-[#b5b5b5]">
        {
          desc.map(
            (line, index) => (
              <p key={index}>{line}</p>
            )
          )
        }
      </div>
    </div>
  )
}
