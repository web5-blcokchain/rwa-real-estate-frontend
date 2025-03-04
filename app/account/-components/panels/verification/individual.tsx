import INotice from '@/components/common/i-notice'
import { Button } from 'antd'
import UploadCard from '../../upload-card'

export default function IndividualVerification() {
  return (
    <div className="fccc gap-2">
      <div className="max-w-md text-center text-8 font-medium">Personal Identity Verification</div>
      <div className="max-w-md text-center text-4 text-[#898989]">Please upload your personal identity documents for KYC verification</div>

      <div className="mt-8 max-w-lg w-full space-y-6">
        <UploadCard
          label="Identity Document"
          title="Upload Identity Card / Passport"
          subTitle="Front and back sides required, JPG/PNG/PDF up to 5MB"
          icon="/assets/icons/id-card.svg"
        >
          <div className="grid grid-cols-2 gap-4">
            <Button type="primary" size="large">
              <div className="fyc gap-2">
                <span className="i-material-symbols-photo-camera-rounded bg-black text-5"></span>
                <span className="text-black">Take Photo</span>
              </div>
            </Button>
            <Button type="primary" size="large">
              <div className="fyc gap-2">
                <span className="i-mdi-folder-open bg-black text-5"></span>
                <span className="text-black">Browse Files</span>
              </div>
            </Button>
          </div>
        </UploadCard>

        <UploadCard
          label="Proof of Address"
          title="Upload Utility Bill / Bank Statement"
          subTitle="Must be issued within last 3 months"
          icon="/assets/icons/document.svg"
        >
        </UploadCard>

        <UploadCard
          label="Facial Verification"
          title="Take a Selfie"
          subTitle="Clear facial photo in good lighting"
          icon="/assets/icons/user-circular.svg"
        >
        </UploadCard>

        <INotice borderClass="b-white" pointClass="bg-white">
          All submitted documents must be authentic and unmodified.
          Please ensure images are clear and complete.
          The verification process typically takes 1-2 business days.
          Your personal information is protected with bank-level encryption.
        </INotice>

        <div className="fec">
          <Button size="large" className="bg-transparent! text-white! hover:text-primary-1!">
            Continue
          </Button>
        </div>
      </div>
    </div>
  )
}
