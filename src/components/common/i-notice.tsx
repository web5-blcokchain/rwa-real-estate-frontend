import type { DetailedHTMLProps, InputHTMLAttributes } from 'react'

interface Props extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  borderClass?: string
  pointClass?: string
  textClass?: string
}

const INotice: FC<Props> = ({
  children,
  className,
  borderClass,
  pointClass,
  textClass,
  ...props
}) => {
  return (
    <div
      {...props}
      className={cn(
        'i-notice',
        'flex gap-4 b b-solid b-border rounded-xl px-6 py-8',
        borderClass,
        className
      )}
    >
      <div className={cn(
        'pr top-1 size-4 fcc shrink-0 rounded-full bg-primary-1',
        pointClass
      )}
      >
      </div>

      <div className={cn(
        'text-[#d2d2d2]',
        textClass
      )}
      >
        {children}
      </div>
    </div>
  )
}

export default INotice
