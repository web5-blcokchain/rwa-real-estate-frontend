import React from 'react'

export const TitleCard: FC<{
  title: string
  selectSlot?: React.ReactNode
}> = ({
  children,
  className,
  title,
  selectSlot
}) => {
  return (
    <div className={cn(
      'rounded-xl bg-[#202329] p-5',
      className
    )}
    >
      <div className="flex items-center justify-between text-5">
        <div>{title}</div>
        {selectSlot}
      </div>
      <div className="mt-4">
        {children}
      </div>
    </div>
  )
}
