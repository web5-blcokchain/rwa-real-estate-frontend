import INotice from '@/components/common/i-notice'
import { Button } from 'antd'
import UploadCard from '../../upload-card'

export default function InstitutionalVerification() {
  return (
    <div className="fccc gap-2">
      <div className="max-w-md text-center text-8 font-medium">Business Verification</div>
      <div className="max-w-md text-center text-4 text-[#898989]">Please upload your business documents for KYB verification</div>

      <div className="mt-8 max-w-lg w-full space-y-6">
        <UploadCard
          label="Business Registration"
          title="Upload Utility Bill / Bank Statement"
          subTitle="Valid business registration document"
          icon="/assets/icons/upload-cloud.svg"
        >
        </UploadCard>

        <UploadCard
          label="Company Structure"
          title="Shareholder Structure / Organization Chart"
          subTitle="Documents showing ownership structure"
          icon="/assets/icons/node-tree.svg"
        >
        </UploadCard>

        <UploadCard
          label="Legal Representative"
          title="Directors and Executives Documents"
          subTitle="Identity documents of key personnel"
          icon="/assets/icons/legal-representative.svg"
        >
        </UploadCard>

        <UploadCard
          label="Financial Documents"
          title="Bank Statements / Financial Reports"
          subTitle="Financial records for the last 6 months"
          icon="/assets/icons/financial-documents.svg"
        >
        </UploadCard>

        <INotice borderClass="b-white" pointClass="bg-white">
          Business verification typically takes 3-5 business days.
          All documents must be officially issued and valid.
          Additional documents may be required based on your business type and jurisdiction.
          Your business information is protected with enterprise-level security.
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
