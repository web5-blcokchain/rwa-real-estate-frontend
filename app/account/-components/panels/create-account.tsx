import IFormItem from "@/components/common/i-form-item";
import IInput from "@/components/common/i-input";
import ISeparator from "@/components/common/i-separator";

export default function CreateAccountPanel() {
  return (
    <div className="fccc gap-2">
      <div className="text-8 font-medium">Create Your Account</div>
      <div className="text-4 text-[#898989]">Start your digital asset journey</div>

      <div className="w-full max-w-xl space-y-6">
        <IFormItem label="Email">
          <IInput placeholder="Enter your email" className="w-full" />
        </IFormItem>

        <IFormItem label="Phone Number">
          <IInput placeholder="Enter your phone number" className="w-full" />
        </IFormItem>

        <IFormItem label="Password" description="Minimum 8 characters with upper, lower case and numbers">
          <IInput placeholder="Enter password" className="w-full" />
        </IFormItem>

        <button className="bg-primary-2 text-background h-12.5 w-full rounded clickable-99">Create Account</button>

        <ISeparator text="or" />

        <div className="grid grid-cols-2 gap-4">
          <button className="py-3 fyc justify-center gap-3 b b-border rounded clickable-99">
            <span className="i-ion-logo-google size-5"></span>
            <span>Sign in with Google</span>
          </button>

          <button className="py-3 fyc justify-center gap-3 b b-border rounded clickable-99">
            <span className="i-ion-logo-apple size-5"></span>
            <span>Sign in with Apple</span>
          </button>
        </div>
      </div>
    </div>
  )
}
