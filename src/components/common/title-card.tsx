export const TitleCard: FC<{
  title: string
}> = ({
  children,
  className,
  title
}) => {
  return (
    <div className={cn(
      'rounded-xl bg-[#202329] p-6',
      className
    )}
    >
      <div className="text-5">{title}</div>
      <div className="mt-4">
        {children}
      </div>
    </div>
  )
}
