import type { InputProps } from 'antd'
import { Form, Input } from 'antd'
import { useEffect, useState } from 'react'
import { z } from 'zod'

interface IInputProps extends InputProps {
  schema?: z.ZodType<any>
  name?: string
  formItemProps?: any
  onValidate?: (name: string, error: string | null) => void
}

const IInput: FC<IInputProps> = ({
  className,
  schema,
  name,
  onChange,
  formItemProps,
  onValidate,
  value,
  ...props
}) => {
  const [error, setError] = useState<string | null>(null)

  // 增加对输入值的监听，实时验证
  useEffect(() => {
    if (schema && name && value !== undefined) {
      validateValue(value as string)
    }
  }, [value, schema, name])

  const validateValue = (val: string) => {
    if (!schema)
      return null

    try {
      schema.parse(val)
      setError(null)
      onValidate?.(name || '', null)
      return null
    }
    catch (err) {
      if (err instanceof z.ZodError) {
        const errMsg = err.errors[0].message
        setError(errMsg)
        onValidate?.(name || '', errMsg)
        return errMsg
      }
    }
    return null
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value

    if (schema) {
      validateValue(val)
    }

    onChange?.(e)
  }

  // 如果有 name，使用 Form.Item 包裹
  if (name) {
    return (
      <Form.Item
        name={name}
        validateStatus={error ? 'error' : ''}
        help={error}
        {...formItemProps}
      >
        <Input
          {...props}
          onChange={handleChange}
          className={
            cn(
              className,
              'bg-transparent! text-white! placeholder:text-text-secondary',
              'px-4 py-3 b b-border b-solid rounded'
            )
          }
        />
      </Form.Item>
    )
  }

  // 独立使用，不与 Form 关联
  return (
    <div>
      <Input
        {...props}
        onChange={handleChange}
        className={
          cn(
            className,
            'bg-transparent! text-white! placeholder:text-text-secondary',
            'px-4 py-3 b b-border b-solid rounded'
          )
        }
      />
      {error && <div className="mt-1 text-xs text-red-500">{error}</div>}
    </div>
  )
}

export default IInput
