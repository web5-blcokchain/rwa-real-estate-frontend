export const DetailCard: FC<{
  title: string
}> = ({
  children,
  title
}) => {
  return (
    <div className="rounded-xl bg-[#202329] p-6">
      <div className="text-5">{title}</div>
      <div className="mt-4">
        {children}
      </div>
    </div>
  )
}
