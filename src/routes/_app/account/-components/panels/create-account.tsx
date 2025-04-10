import IFormItem from '@/components/common/i-form-item'
import IInput from '@/components/common/i-input'
import ISeparator from '@/components/common/i-separator'
import { LoginButton } from '@/components/common/login-button'
import { useUserStore } from '@/stores/user'
import { usePrivy } from '@privy-io/react-auth'
import { useSteps } from '../steps-provider'

export default function CreateAccountPanel() {
  const { t } = useTranslation()
  const { next } = useSteps()
  const { setRegisterData } = useUserStore()

  const { login } = usePrivy()

  return (
    <div className="fccc gap-2">
      <div className="text-8 font-medium">{t('create.step1')}</div>
      <div className="text-4 text-[#898989]">{t('create.baseInfo.subTitle')}</div>

      <div className="max-w-xl w-full space-y-6">
        <IFormItem label="Email">
          <IInput placeholder="Enter your email" className="w-full" onChange={e => setRegisterData({ email: e.target.value })} />
        </IFormItem>

        <IFormItem label="Phone Number">
          <IInput placeholder="Enter your phone number" className="w-full" onChange={e => setRegisterData({ mobile: e.target.value })} />
        </IFormItem>

        <IFormItem label="Password" description="Minimum 8 characters with upper, lower case and numbers">
          <IInput placeholder="Enter password" className="w-full" onChange={e => setRegisterData({ password: e.target.value })} />
        </IFormItem>

        <button
          type="button"
          className="h-12.5 w-full rounded bg-primary-2 text-background clickable-99"
          onClick={next}
        >
          {t('create.button.next')}
        </button>

        <ISeparator text="or" />

        <div className="grid grid-cols-2 gap-4">
          <LoginButton
            icon="i-ion-logo-google"
            onClick={() => login({
              loginMethods: ['google']
            })}
          >
            {t('create.baseInfo.google')}
          </LoginButton>

          <LoginButton
            icon="i-ion-logo-apple"
            onClick={() => login({
              loginMethods: ['apple']
            })}
          >
            {t('create.baseInfo.apple')}
          </LoginButton>
        </div>
      </div>
    </div>
  )
}
