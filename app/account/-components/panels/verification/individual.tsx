import { Button } from 'antd'
import UploadCard from '../../upload-card'

export default function IndividualVerification() {
  return (
    <div className="fccc gap-2">
      <div className="max-w-md text-center text-8 font-medium">Personal Identity Verification</div>
      <div className="max-w-md text-center text-4 text-[#898989]">Please upload your personal identity documents for KYC verification</div>

      <div className="mt-8 max-w-lg w-full">
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
      </div>
    </div>
  )
}
