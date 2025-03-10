import type { DetailedHTMLProps, HTMLAttributes } from 'react'

interface Props {
  text?: string
}

const ISeparator: FC<
  Props & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
> = ({
  text,
  className,
  ...props
}) => {
  if (!text) {
    return (
      <div
        {...props}
        className={cn(
          className,
          'w-full h-0.25 bg-border'
        )}
      >
      </div>
    )
  }

  return (
    <div
      {...props}
      className={cn(
        className,
        'w-full fbc gap-2'
      )}
    >
      <div className="h-1px w-full bg-border"></div>
      <div className="text-4 text-[#b5b5b5]">{text}</div>
      <div className="h-1px w-full bg-border"></div>
    </div>
  )
}

export default ISeparator
