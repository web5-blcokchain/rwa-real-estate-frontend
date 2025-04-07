import { Select } from 'antd'

import './selectComponent.scss'

const SelectComponent: FC<{
  defaultValue: string
  options: { value: string, label: string, disabled?: boolean }[]
}> = ({
  defaultValue,
  options
}) => {
  const handleChange = (value: string) => {
    console.log(`selected ${value}`)
  }

  return (
    <div>
      <Select
        defaultValue={defaultValue}
        onChange={handleChange}
        options={options}
        className="custom-select"
        dropdownStyle={{ backgroundColor: '#242933' }}
      />
    </div>
  )
}

export default SelectComponent
