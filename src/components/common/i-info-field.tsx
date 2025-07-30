export const IInfoField: FC<{
  label: string
  value: string | number
  horizontal?: boolean
  labelClass?: string
  valueClass?: string
}> = ({
  label,
  value,
  horizontal = false,
  className,
  labelClass,
  valueClass
}) => {
  return (
    <div className={cn(
      horizontal ? 'flex items-center gap-1' : 'space-y-4 py-4',
      className
    )}
    >
      <div className={cn(
        ' text-[#d9d9d9]',
        labelClass
      )}
      >
        {label}
      </div>
      <div className={cn(
        '',
        valueClass
      )}
      >
        {value}
      </div>
    </div>
  )
}
