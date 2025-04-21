import { IImage } from '@/components/common/i-image'
import { useUserStore } from '@/stores/user'
import { joinImagePath } from '@/utils/url'
import { Button, Form, Input } from 'antd'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export const ProfileEdit: FC = () => {
  const { userData } = useUserStore()
  const [form] = Form.useForm()
  const { t } = useTranslation()

  useEffect(() => {
    if (userData) {
      form.setFieldsValue({
        name: userData.nickname,
        email: userData.email,
        phone: userData.mobile || '',
        location: userData.address || ''
      })
    }
  }, [userData, form])

  const onFinish = (values: any) => {
    console.log('Form values:', values)
    // 这里可以添加更新用户信息的逻辑
  }

  return (
    <div className="p-8 text-white">
      <div className="text-8 font-medium">
        {t('profile.edit.account_management')}
      </div>
      <div className="mt-2 text-4 text-[#898989]">
        {t('profile.edit.account_management_desc')}
      </div>

      <div className="mt-8 rounded-xl bg-[#1e2024] p-8">
        <div className="mb-8 text-6 font-medium">{t('profile.edit.basic_info')}</div>

        <div className="mb-8 flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          <div className="size-32 flex items-center justify-center overflow-hidden rounded-full bg-[#242933]">
            {userData?.avatar
              ? (
                  <IImage
                    src={joinImagePath(userData.avatar)}
                    className="size-full"
                    imgClass="object-cover"
                  />
                )
              : (
                  <div className="i-material-symbols-person size-20 text-[#9e9e9e]"></div>
                )}
          </div>

          <div className="flex flex-col items-center sm:items-start">
            <Button
              className="border-none! bg-[#242933]! text-white!"
              size="large"
            >
              {t('profile.edit.upload')}
            </Button>
            <div className="mt-2 text-[#9e9e9e]">
              {t('profile.edit.upload_desc')}
            </div>
          </div>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="w-full"
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Form.Item
              label={<span className="text-4 text-white">{t('profile.edit.name')}</span>}
              name="name"
              className="mb-6"
            >
              <Input
                className="h-14 text-4 bg-[#242933]! text-white!"
                size="large"
              />
            </Form.Item>

            <Form.Item
              label={<span className="text-4 text-white">{t('profile.edit.phone')}</span>}
              name="phone"
              className="mb-6"
            >
              <Input
                className="h-14 text-4 bg-[#242933]! text-white!"
                size="large"
                placeholder={t('profile.edit.phone_placeholder')}
              />
            </Form.Item>

            <Form.Item
              label={<span className="text-4 text-white">{t('profile.edit.email')}</span>}
              name="email"
              className="mb-6"
            >
              <Input
                className="h-14 text-4 bg-[#242933]! text-white!"
                size="large"
                placeholder={t('profile.edit.email_placeholder')}
              />
            </Form.Item>

            <Form.Item
              label={<span className="text-4 text-white">{t('profile.edit.location')}</span>}
              name="location"
              className="mb-6"
            >
              <Input
                className="h-14 text-4 bg-[#242933]! text-white!"
                size="large"
                placeholder={t('profile.edit.location_placeholder')}
              />
            </Form.Item>
          </div>

          <div className="mt-6 flex justify-end">
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              className="px-8 text-black!"
            >
              {t('profile.edit.save')}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  )
}
