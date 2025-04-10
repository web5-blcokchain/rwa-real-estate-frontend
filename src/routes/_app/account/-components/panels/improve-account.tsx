import IFormItem from '@/components/common/i-form-item'
import IInput from '@/components/common/i-input'
import { useUserStore } from '@/stores/user'
import { usePrivy } from '@privy-io/react-auth'
import { useSteps } from '../steps-provider'

export default function CreateAccountPanel() {
  const { t } = useTranslation()
  const { next } = useSteps()
  const { setRegisterData } = useUserStore()

  const { user } = usePrivy()

  useEffect(() => {
    if (!user?.email) {
      return
    }

    setRegisterData({
      email: user.email.address
    })
  }, [user?.email])

  return (
    <div className="fccc gap-2">
      <div className="text-8 font-medium">{t('create.step2')}</div>
      <div className="text-4 text-[#898989]">{t('create.baseInfo.subTitle')}</div>

      <div className="max-w-xl w-full space-y-6">
        <IFormItem label="Email">
          <IInput
            value={user!.email!.address}
            placeholder="Email"
            className="w-full text-[#898989]"
            disabled
          />
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
      </div>
    </div>
  )
}
