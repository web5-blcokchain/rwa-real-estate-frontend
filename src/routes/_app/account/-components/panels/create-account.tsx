import type { RegisterParams } from '@/api/apiMyInfoApi'
import apiMyInfo from '@/api/apiMyInfoApi'
import IFormItem from '@/components/common/i-form-item'
import IInput from '@/components/common/i-input'
import ISeparator from '@/components/common/i-separator'
import { LoginButton } from '@/components/common/login-button'
import { useUserStore } from '@/stores/user'
import { usePrivy } from '@privy-io/react-auth'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useSteps } from '../steps-provider'

export default function CreateAccountPanel() {
  const { t } = useTranslation()
  const { next } = useSteps()
  const navigate = useNavigate()
  const setRegisterData = useUserStore(state => state.setRegisterData)

  const { authenticated, user, linkApple, linkGoogle } = usePrivy()

  const { mutate: createMutate } = useMutation({
    mutationFn: async (data: RegisterParams) => {
      const res = await apiMyInfo.register(data)
      navigate({ to: '/home' })
      return res?.data
    }
  })

  useEffect(() => {
    if (authenticated && user) {
      const data = {
        mobile: user?.phone?.number,
        email: user?.email?.address,
        wallet_address: user?.wallet?.address,
        business_registration_document: '',
        shareholder_structure_url: '',
        legal_representative_documents_url: '',
        financial_documents_url: '',
        token: ''

      }
      createMutate(data)
    }
  }, [authenticated, user, createMutate])

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

        <button type="button" className="h-12.5 w-full rounded bg-primary-2 text-background clickable-99" onClick={next}>Create Account</button>

        <ISeparator text="or" />

        <div className="grid grid-cols-2 gap-4">
          <LoginButton icon="i-ion-logo-google" onClick={linkGoogle}>
            {t('create.baseInfo.google')}
          </LoginButton>

          <LoginButton icon="i-ion-logo-apple" onClick={linkApple}>
            {t('create.baseInfo.apple')}
          </LoginButton>
        </div>
      </div>
    </div>
  )
}
