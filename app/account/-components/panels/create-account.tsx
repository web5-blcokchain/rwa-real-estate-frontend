import IFormItem from '@/components/common/i-form-item'
import IInput from '@/components/common/i-input'
import ISeparator from '@/components/common/i-separator'
import { useSteps } from '../steps-provider'

export default function CreateAccountPanel() {
  const { next } = useSteps()
  return (
    <div className="fccc gap-2">
      <div className="text-8 font-medium">Create Your Account</div>
      <div className="text-4 text-[#898989]">Start your digital asset journey</div>

      <div className="max-w-xl w-full space-y-6">
        <IFormItem label="Email">
          <IInput placeholder="Enter your email" className="w-full" />
        </IFormItem>

        <IFormItem label="Phone Number">
          <IInput placeholder="Enter your phone number" className="w-full" />
        </IFormItem>

        <IFormItem label="Password" description="Minimum 8 characters with upper, lower case and numbers">
          <IInput placeholder="Enter password" className="w-full" />
        </IFormItem>

        <button className="h-12.5 w-full rounded bg-primary-2 text-background clickable-99" onClick={next}>Create Account</button>

        <ISeparator text="or" />

        <div className="grid grid-cols-2 gap-4">
          <button className="fyc justify-center gap-3 b b-border rounded py-3 clickable-99">
            <span className="i-ion-logo-google size-5"></span>
            <span>Sign in with Google</span>
          </button>

          <button className="fyc justify-center gap-3 b b-border rounded py-3 clickable-99">
            <span className="i-ion-logo-apple size-5"></span>
            <span>Sign in with Apple</span>
          </button>
        </div>
      </div>
    </div>
  )
}
