import type { SelectProps } from 'antd'
import { Select } from 'antd'

import './styles.scss'

const SelectComponent: FC<SelectProps> = ({
  className,
  ...props
}) => {
  return (
    <Select
      className={cn(
        'custom-select',
        className
      )}
      {...props}
    />
  )
}

export default SelectComponent
