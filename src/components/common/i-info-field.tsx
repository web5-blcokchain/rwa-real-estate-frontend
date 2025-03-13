export const IInfoField: FC<{
  label: string
  value: string
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
      'space-y-4',
      horizontal ? 'flex items-center justify-between' : 'py-4',
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
