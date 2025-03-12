export const IInfoField: FC<{
  label: string
  value: string
  labelClass?: string
  valueClass?: string
}> = ({
  label,
  value,
  className,
  labelClass,
  valueClass
}) => {
  return (
    <div className={cn(
      'py-4 space-y-4',
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
