import type { DetailedHTMLProps, HTMLAttributes } from 'react'
import { cn } from '@/utils/style'

interface Props {
  label?: string
  description?: string
}

const IFormItem: FC<
  Props & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
> = ({
  label,
  description,
  className,
  children,
  ...props
}) => {
  return (
    <div
      {...props}
      className={
        cn(
          className,
          'space-y-2'
        )
      }
    >
      {
        label
        && (
          <div className="text-4 text-text">{label}</div>
        )
      }

      <div>{children}</div>

      {
        description
        && (
          <div className="text-3.5 text-[#b5b5b5]">{description}</div>
        )
      }
    </div>
  )
}

export default IFormItem
