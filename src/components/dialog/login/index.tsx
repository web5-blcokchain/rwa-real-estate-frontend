import type { Dispatch, SetStateAction } from 'react'
import IFormItem from '@/components/common/i-form-item'
import IInput from '@/components/common/i-input'
import ISeparator from '@/components/common/i-separator'
import { LoginButton } from '@/components/common/login-button'
import { usePrivy } from '@privy-io/react-auth'
import { Button, Checkbox, Modal } from 'antd'
import './styles.scss'

export const LoginDialog: FC<{
  openState: [boolean, Dispatch<SetStateAction<boolean>>]
}> = ({
  openState
}) => {
  const { login } = usePrivy()
  const { t } = useTranslation()

  const [open, setOpen] = openState

  const [form, setForm] = useState({
    email: '',
    password: ''
  })

  function setFormData(data: Partial<typeof form>) {
    setForm(prev => ({
      ...prev,
      ...data
    }))
  }

  function loginWithEmail() {
    console.log('form', form)
  }

  return (
    <Modal
      open={open}
      footer={null}
      width={680}
      maskClosable={false}
      className="login-dialog"
      onCancel={() => setOpen(false)}
    >
      <div className="mx-a w-128 py-16">
        <div className="text-center text-8 font-medium">Great to have you back!</div>
        <div className="text-center text-4 text-[#898989]">Start your digital asset journey</div>

        <div className="space-y-6">
          <IFormItem label="Email">
            <IInput placeholder="Enter your email" className="w-full" onChange={e => setFormData({ email: e.target.value })} />
          </IFormItem>

          <IFormItem label="Password">
            <IInput placeholder="Enter password" className="w-full" onChange={e => setFormData({ password: e.target.value })} />
          </IFormItem>

          <div>
            <Checkbox className="text-text">Remember Me</Checkbox>
          </div>

          <div className="space-y-2">
            <Button
              type="primary"
              size="large"
              className="text-black!"
              block
              onClick={loginWithEmail}
            >
              Login
            </Button>
            <div className="text-primary">
              <div className="inline-block select-none clickable-98">Forgot Password?</div>
            </div>
          </div>
        </div>

        <ISeparator text="or" className="my-4" />

        <div className="space-y-6">
          <LoginButton
            icon="i-ion-logo-google"
            className="w-full"
            onClick={() => login({
              loginMethods: ['google']
            })}
          >
            {t('login.sign_in_with_google')}
          </LoginButton>

          <LoginButton
            icon="i-ion-logo-apple"
            className="w-full"
            onClick={() => login({
              loginMethods: ['apple']
            })}
          >
            {t('login.sign_in_with_apple')}
          </LoginButton>

          <LoginButton
            icon="i-mingcute-wallet-4-fill"
            className="w-full"
            onClick={() => login({
              loginMethods: ['wallet']
            })}
          >
            {t('login.sign_in_with_wallet')}
          </LoginButton>
        </div>
      </div>
    </Modal>
  )
}
