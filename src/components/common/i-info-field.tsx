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
      horizontal ? 'flex items-center justify-between' : 'space-y-4 py-4',
      className
    )}
    >
      <div className={cn(
        'text-3.5 text-[#d9d9d9]',
        labelClass
      )}
      >
        {label}
      </div>
      <div className={cn(
        'text-4',
        valueClass
      )}
      >
        {value}
      </div>
    </div>
  )
}
