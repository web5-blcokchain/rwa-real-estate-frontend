export const TimelineCard: FC<{
  year: string
  title: string
}> = ({
  year,
  title
}) => {
  return (
    <div className="pr pl-6 pt-6">
      <div className="pa left-0 top-2 size-4 rounded-full bg-primary-2"></div>
      <div className="h-full bg-[#22252c] p-6 text-4 space-y-2">
        <div className="text-primary-2">{year}</div>
        <div className="text-[#b5b5b5]">{title}</div>
      </div>
    </div>
  )
}
