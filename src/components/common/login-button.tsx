import type { ButtonHTMLAttributes, DetailedHTMLProps } from 'react'

export const LoginButton: FC<{
  icon: string
} & DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
> = ({
  icon,
  children,
  className,
  ...props
}) => {
  return (
    <button
      type="button"
      className={cn(
        'fyc justify-center gap-3 py-3 clickable-99',
        'b b-border rounded bg-transparent',
        className
      )}
      {...props}
    >
      <span className={cn(
        'size-5',
        icon
      )}
      >
      </span>
      <span>{children}</span>
    </button>
  )
}
