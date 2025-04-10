import IFormItem from '@/components/common/i-form-item'
import IInput from '@/components/common/i-input'
import { useUserStore } from '@/stores/user'
import { usePrivy } from '@privy-io/react-auth'
import { Form } from 'antd'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import { useSteps } from '../steps-provider'

export default function CreateAccountPanel() {
  const { t } = useTranslation()
  const { next } = useSteps()
  const { registerData, setRegisterData } = useUserStore()
  const [form] = Form.useForm()
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({})

  const { user } = usePrivy()

  // 定义 zod schema
  const phoneSchema = z.string()
    .nonempty('Phone number cannot be empty')
    .min(5, 'Phone number is too short')
    .regex(/^[0-9+\-\s]+$/, 'Invalid phone format')

  const passwordSchema = z.string()
    .nonempty('Password cannot be empty')
    .min(8, 'Password must be at least 8 characters')
    .regex(/[a-z]/, 'Password must contain lowercase letters')
    .regex(/[A-Z]/, 'Password must contain uppercase letters')
    .regex(/\d/, 'Password must contain numbers')

  // 初始化表单数据 - 从 store 读取已有数据
  useEffect(() => {
    const initValues: any = {}

    if (registerData?.mobile) {
      initValues.phone = registerData.mobile
    }

    if (registerData?.password) {
      initValues.password = registerData.password
    }

    // 设置初始表单值
    if (Object.keys(initValues).length > 0) {
      form.setFieldsValue(initValues)
    }
  }, [])

  useEffect(() => {
    if (!user?.email) {
      return
    }

    setRegisterData({
      ...registerData, // 保留现有数据
      email: user.email.address
    })
  }, [user?.email])

  // 处理单个字段的验证回调
  const handleValidate = (fieldName: string, error: string | null) => {
    setFormErrors((prev) => {
      if (!error) {
        // 如果没有错误，从错误对象中移除该字段
        const { [fieldName]: _, ...rest } = prev
        return rest
      }
      else {
        // 如果有错误，更新错误信息
        return { ...prev, [fieldName]: error }
      }
    })
  }

  // 检查表单是否有错误
  const hasErrors = () => {
    return Object.keys(formErrors).length > 0
  }

  const validateForm = async () => {
    let isValid = true
    const values = await form.getFieldsValue()
    const errors: { [key: string]: string } = {}

    // 手动验证所有字段
    if (!values.phone) {
      errors.phone = 'Phone number cannot be empty'
      isValid = false
    }
    else {
      try {
        phoneSchema.parse(values.phone)
      }
      catch (err) {
        if (err instanceof z.ZodError) {
          errors.phone = err.errors[0].message
          isValid = false
        }
      }
    }

    if (!values.password) {
      errors.password = 'Password cannot be empty'
      isValid = false
    }
    else {
      try {
        passwordSchema.parse(values.password)
      }
      catch (err) {
        if (err instanceof z.ZodError) {
          errors.password = err.errors[0].message
          isValid = false
        }
      }
    }

    setFormErrors(errors)
    return isValid
  }

  const handleSubmit = async () => {
    try {
      // 先获取表单值
      const formValues = form.getFieldsValue()

      // 手动验证
      const isValid = await validateForm()

      // 验证未通过或有错误，不继续
      if (!isValid || hasErrors()) {
        console.error('Validation failed')
        return
      }

      // 验证通过，更新数据并继续
      setRegisterData({
        ...registerData, // 保留其他数据
        mobile: formValues.phone,
        password: formValues.password
      })

      next()
    }
    catch (error) {
      console.error('Form submission failed:', error)
    }
  }

  return (
    <div className="fccc gap-2">
      <div className="text-8 font-medium">{t('create.step2')}</div>
      <div className="text-4 text-[#898989]">{t('create.baseInfo.subTitle')}</div>

      <div className="max-w-xl w-full">
        <Form
          form={form}
          layout="vertical"
          className="space-y-6"
          initialValues={{
            phone: registerData?.mobile || '',
            password: registerData?.password || ''
          }}
        >
          <IFormItem label="Email">
            <IInput
              defaultValue={user!.email!.address}
              placeholder="Email"
              className="w-full text-[#898989]"
              disabled
            />
          </IFormItem>

          <IFormItem label="Phone Number">
            <IInput
              name="phone"
              placeholder="Enter your phone number"
              className="w-full"
              schema={phoneSchema}
              onValidate={handleValidate}
              onChange={(e) => {
                const val = e.target.value
                form.setFieldsValue({ phone: val })
                setRegisterData({
                  ...registerData, // 保留其他数据
                  mobile: val
                })
              }}
              formItemProps={{
                validateStatus: formErrors.phone ? 'error' : '',
                help: formErrors.phone
              }}
            />
          </IFormItem>

          <IFormItem label="Password" description="Minimum 8 characters with upper, lower case and numbers">
            <IInput
              name="password"
              placeholder="Enter password"
              className="w-full"
              type="password"
              schema={passwordSchema}
              onValidate={handleValidate}
              onChange={(e) => {
                const val = e.target.value
                form.setFieldsValue({ password: val })
                setRegisterData({
                  ...registerData, // 保留其他数据
                  password: val
                })
              }}
              formItemProps={{
                validateStatus: formErrors.password ? 'error' : '',
                help: formErrors.password
              }}
            />
          </IFormItem>

          <button
            type="button"
            className="h-12.5 w-full rounded bg-primary-2 text-background clickable-99"
            onClick={handleSubmit}
          >
            {t('create.button.next')}
          </button>
        </Form>
      </div>
    </div>
  )
}
