import type { DetailedHTMLProps, InputHTMLAttributes } from 'react'
import { cn } from '@/utils/style'

const IInput: FC<DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>> = ({
  className,
  ...props
}) => {
  return (
    <input
      type="text"
      {...props}
      className={
        cn(
          className,
          'outline-none bg-transparent',
          'px-4 py-3 b b-border b-solid rounded'
        )
      }
    />
  )
}

export default IInput
