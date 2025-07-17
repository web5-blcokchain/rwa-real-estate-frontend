import type { ConnectedWallet } from '@privy-io/react-auth'
import { uploadFile } from '@/api/apiMyInfoApi'
import { updateProfile } from '@/api/profile'
import { IImage } from '@/components/common/i-image'
import { WalletSelector } from '@/components/common/wallet-selector'
import { useUserStore } from '@/stores/user'
import { joinImagePath } from '@/utils/url'
import { useWallets } from '@privy-io/react-auth'
import { Button, Form, Input, message } from 'antd'
import { useTranslation } from 'react-i18next'

export const ProfileEdit: FC = () => {
  const { userData, setUserData } = useUserStore()
  const [form] = Form.useForm()
  const { t } = useTranslation()
  const { wallets } = useWallets()

  const fileInputRef = useRef<HTMLInputElement>(null)

  const [saving, setSaving] = useState(false)
  const [wallet, setWallet] = useState<ConnectedWallet | null>(null)

  useEffect(() => {
    if (userData) {
      form.setFieldsValue({
        avatar: userData.avatar,
        nickname: userData.nickname,
        email: userData.email,
        mobile: userData.mobile || '',
        address: userData.address || ''
      })
    }
  }, [userData, form])

  useEffect(() => {
    if (wallets.length > 0) {
      const boundWallet = wallets.find(w => w.address === userData.wallet_address)

      if (boundWallet) {
        setWallet(boundWallet)
      }
    }
  }, [userData, wallets])

  const onFinish = async (values: any) => {
    try {
      setSaving(true)

      const profileData = {
        nickname: values.nickname,
        email: values.email,
        mobile: values.mobile,
        address: values.address,
        avatar: userData.avatar,
        wallet_address: wallet!.address
      }

      await updateProfile(profileData)

      // 更新用户数据
      setUserData({
        ...userData,
        ...profileData
      })

      message.success(t('common.save_success'))
    }
    catch (error) {
      console.error('Failed to save profile:', error)
      message.error(t('common.save_failed'))
    }
    finally {
      setSaving(false)
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file)
      return

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await uploadFile(formData)

      const avatarUrl = _get(response, 'data.file.url')

      if (avatarUrl) {
        // 更新用户数据中的头像
        setUserData({
          ...userData,
          avatar: avatarUrl
        })

        // 更新表单中的头像字段
        form.setFieldsValue({
          avatar: response.data
        })

        message.success(t('profile.edit.upload_success'))
      }
      else {
        toast.error(t('profile.edit.upload_failed'))
      }
    }
    catch (error) {
      console.error('Upload failed:', error)
      message.error(t('profile.edit.upload_failed'))
    }

    // 重置文件输入以允许再次选择相同的文件
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
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
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <Button
              className="border-none! bg-[#242933]! text-white!"
              size="large"
              onClick={handleUploadClick}
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
              name="nickname"
              className="mb-6"
            >
              <Input
                className="h-14 text-4 bg-[#242933]! text-white!"
                size="large"
              />
            </Form.Item>

            {/* <Form.Item
              label={<span className="text-4 text-white">{t('profile.edit.phone')}</span>}
              name="mobile"
              className="mb-6"
            >
              <Input
                className="h-14 text-4 bg-[#242933]! text-white!"
                size="large"
                placeholder={t('profile.edit.phone_placeholder')}
              />
            </Form.Item> */}

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
              name="address"
              className="mb-6"
            >
              <Input
                className="h-14 text-4 bg-[#242933]! text-white!"
                size="large"
                placeholder={t('profile.edit.location_placeholder')}
              />
            </Form.Item>
          </div>

          <div>
            <WalletSelector
              walletState={[wallet, setWallet]}
              title={t('profile.edit.bind_wallet')}
            />
          </div>

          <div className="mt-6 flex justify-end">
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              className="px-8 text-black!"
              loading={saving}
            >
              {t('profile.edit.save')}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  )
}
