import apiMyInfo from '@/api/apiMyInfoApi'
import INotice from '@/components/common/i-notice'
import { useUserStore } from '@/stores/user'
import { useMutation } from '@tanstack/react-query'
import { Button } from 'antd'
import UploadCard from '../../upload-card'
import './individual.scss'

export default function InstitutionalVerification() {
  const setRegisterData = useUserStore(state => state.setRegisterData)
  const RegisterData = useUserStore(state => state.registerData)

  const { mutate: updateFile } = useMutation({
    mutationFn: async (data: { file: File, key: string }) => {
      const formData = new FormData()
      formData.append('file', data.file)
      const res = await apiMyInfo.uploadFile(formData)
      setRegisterData({
        ...RegisterData,
        [data.key]: res?.data?.photoUrls || ''
      })
      return res?.data
    },
    onSuccess: (res) => {
      console.log('=-=-=-=onSuccess', res)
    },
    onError: (error) => {
      console.log('=-=-=-=onError', error)
    }
  })

  const { mutate: createMutate } = useMutation({
    mutationFn: async () => {
      const res = await apiMyInfo.register({ ...RegisterData })
      return res?.data
    },
    onSuccess: (res) => {
      console.log('=-=-=-=onSuccess', res)
    },
    onError: (error) => {
      console.log('=-=-=-=onError', error)
    }
  })

  const beforeUpload = (file: File, key: string) => {
    updateFile({ file, key })
  }

  return (
    <div className="fccc gap-2">
      <div className="max-w-md text-center text-8 font-medium">Business Verification</div>
      <div className="max-w-md text-center text-4 text-[#898989]">Please upload your business documents for KYB verification</div>

      <div className="mt-8 max-w-lg w-full space-y-6">
        <UploadCard
          label="Business Registration"
          title="Upload Utility Bill / Bank Statement"
          subTitle="Valid business registration document"
          icon={new URL('@/assets/icons/upload-cloud.svg', import.meta.url).href}
          beforeUpload={(file) => {
            beforeUpload(file, 'business_registration_document')
          }}
        >
        </UploadCard>

        <UploadCard
          label="Company Structure"
          title="Shareholder Structure / Organization Chart"
          subTitle="Documents showing ownership structure"
          icon={new URL('@/assets/icons/node-tree.svg', import.meta.url).href}
          beforeUpload={(file) => {
            beforeUpload(file, 'shareholder_structure_url')
          }}
        >
        </UploadCard>

        <UploadCard
          label="Legal Representative"
          title="Directors and Executives Documents"
          subTitle="Identity documents of key personnel"
          icon={new URL('@/assets/icons/legal-representative.svg', import.meta.url).href}
          beforeUpload={(file) => {
            beforeUpload(file, 'legal_representative_documents_url')
          }}
        >
        </UploadCard>

        <UploadCard
          label="Financial Documents"
          title="Bank Statements / Financial Reports"
          subTitle="Financial records for the last 6 months"
          icon={new URL('@/assets/icons/financial-documents.svg', import.meta.url).href}
          beforeUpload={(file) => {
            beforeUpload(file, 'financial_documents_url')
          }}
        >
        </UploadCard>

        <INotice borderClass="b-white" pointClass="bg-white">
          Business verification typically takes 3-5 business days.
          All documents must be officially issued and valid.
          Additional documents may be required based on your business type and jurisdiction.
          Your business information is protected with enterprise-level security.
        </INotice>

        <div className="fec">
          <Button size="large" className="bg-transparent! text-white! hover:text-primary-1!" onClick={() => createMutate()}>
            Continue
          </Button>
        </div>
      </div>
    </div>
  )
}
