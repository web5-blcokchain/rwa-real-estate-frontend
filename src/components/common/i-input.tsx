import type { InputProps } from 'antd'
import { Input } from 'antd'

const IInput: FC<InputProps> = ({
  className,
  ...props
}) => {
  return (
    <Input
      {...props}
      className={
        cn(
          className,
          'bg-transparent! text-white! placeholder:text-text-secondary',
          'px-4 py-3 b b-border b-solid rounded'
        )
      }
    />
  )
}

export default IInput
