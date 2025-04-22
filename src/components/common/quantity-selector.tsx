import type { ChangeEvent } from 'react'
import { Button, Input } from 'antd'

interface QuantitySelectorProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  disabled?: boolean
}

export default function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = Infinity,
  step = 1,
  disabled = false
}: QuantitySelectorProps) {
  const [inputValue, setInputValue] = useState(value.toString())

  // 同步外部value的变化到内部状态
  useEffect(() => {
    setInputValue(value.toString())
  }, [value])

  const handleDecrease = () => {
    if (disabled)
      return
    const newValue = Math.max(min, value - step)
    onChange(newValue)
  }

  const handleIncrease = () => {
    if (disabled)
      return
    const newValue = Math.min(max, value + step)
    onChange(newValue)
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value
    // 允许空字符串，以便用户清除输入内容后重新输入
    setInputValue(text)

    // 如果是有效的数字，则触发onChange
    const numValue = Number(text)
    if (!_isNaN(numValue) && text !== '') {
      const boundedValue = Math.max(min, Math.min(max, numValue))
      onChange(boundedValue)
    }
  }

  // 输入框失去焦点时，确保显示有效的值
  const handleBlur = () => {
    if (inputValue === '' || _isNaN(Number(inputValue))) {
      setInputValue(value.toString())
    }
    else {
      // 确保数值在限制范围内
      const numValue = Number(inputValue)
      const boundedValue = Math.max(min, Math.min(max, numValue))
      onChange(boundedValue)
      setInputValue(boundedValue.toString())
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        className="b-none text-5 text-white bg-[#374151]!"
        onClick={handleDecrease}
        disabled={disabled || value <= min}
      >
        -
      </Button>
      <Input
        className="w-16 border-[#4b5563] rounded-md bg-[#1e1e24] text-center"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        disabled={disabled}
      />
      <Button
        className="b-none text-5 text-white bg-[#374151]!"
        onClick={handleIncrease}
        disabled={disabled || value >= max}
      >
        +
      </Button>
    </div>
  )
}
