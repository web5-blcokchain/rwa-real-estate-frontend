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
      dropdownStyle={{ backgroundColor: '#242933' }}
      {...props}
    />
  )
}

export default SelectComponent
