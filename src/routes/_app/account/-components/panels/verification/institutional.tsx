import apiMyInfo from '@/api/apiMyInfoApi'
import INotice from '@/components/common/i-notice'
import { UserCode } from '@/enums/user'
import { useUserStore } from '@/stores/user'
import { joinImagePath } from '@/utils/url'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { Button } from 'antd'
import { useTranslation } from 'react-i18next'
import UploadCard from '../../upload-card'
import './individual.scss'

export default function InstitutionalVerification() {
  const { t } = useTranslation()
  const { registerData, setRegisterData, setCode: setExist, clearRegisterData } = useUserStore()
  const navigate = useNavigate()

  // 获取各种文档的URL
  const businessRegistrationUrl = registerData?.business_registration_document || ''
  const shareholderStructureUrl = registerData?.shareholder_structure_url || ''
  const legalRepresentativeUrl = registerData?.legal_representative_documents_url || ''
  const financialDocumentsUrl = registerData?.financial_documents_url || ''

  const { mutate: updateFile } = useMutation({
    mutationFn: async (data: { file: File, key: string }) => {
      const formData = new FormData()
      formData.append('file', data.file)
      const res = await apiMyInfo.uploadFile(formData)
      setRegisterData({
        ...registerData,
        [data.key]: _get(res.data, 'file.url', '')
      })
      return res?.data
    },
    onSuccess: (res) => {
      console.log('onSuccess', res)
    },
    onError: (error) => {
      console.log('onError', error)
    }
  })

  const { mutate: createMutate, isPending } = useMutation({
    mutationFn: async () => {
      const res = await apiMyInfo.register({
        ...registerData
      })
      return res?.data
    },
    onSuccess: () => {
      toast.success(t('create.message.create_success'))
      setExist(UserCode.LoggedIn)
      clearRegisterData()
      navigate({
        to: '/profile'
      })
    }
  })

  const beforeUpload = (file: File, key: string) => {
    updateFile({ file, key })
  }

  return (
    <div className="fccc gap-2">
      <div className="max-w-md text-center text-8 font-medium">{t('create.verification.business.title')}</div>
      <div className="max-w-md text-center text-4 text-[#898989]">{t('create.verification.business.subTitle')}</div>

      <div className="mt-8 max-w-lg w-full space-y-6">
        <UploadCard
          label={t('create.verification.business.business_registration')}
          title={t('create.verification.business.business_registration_title')}
          subTitle={t('create.verification.business.business_registration_subTitle')}
          icon={new URL('@/assets/icons/upload-cloud.svg', import.meta.url).href}
          beforeUpload={(file) => {
            beforeUpload(file, 'business_registration_document')
          }}
          src={joinImagePath(businessRegistrationUrl)}
        >
        </UploadCard>

        <UploadCard
          label={t('create.verification.business.business_company')}
          title={t('create.verification.business.business_company_title')}
          subTitle={t('create.verification.business.business_company_subTitle')}
          icon={new URL('@/assets/icons/node-tree.svg', import.meta.url).href}
          beforeUpload={(file) => {
            beforeUpload(file, 'shareholder_structure_url')
          }}
          src={joinImagePath(shareholderStructureUrl)}
        >
        </UploadCard>

        <UploadCard
          label={t('create.verification.business.legal_representative')}
          title={t('create.verification.business.legal_representative_title')}
          subTitle={t('create.verification.business.legal_representative_subTitle')}
          icon={new URL('@/assets/icons/legal-representative.svg', import.meta.url).href}
          beforeUpload={(file) => {
            beforeUpload(file, 'legal_representative_documents_url')
          }}
          src={joinImagePath(legalRepresentativeUrl)}
        >
        </UploadCard>

        <UploadCard
          label={t('create.verification.business.financial_documents')}
          title={t('create.verification.business.financial_documents_title')}
          subTitle={t('create.verification.business.financial_documents_subTitle')}
          icon={new URL('@/assets/icons/financial-documents.svg', import.meta.url).href}
          beforeUpload={(file) => {
            beforeUpload(file, 'financial_documents_url')
          }}
          src={joinImagePath(financialDocumentsUrl)}
        >
        </UploadCard>

        <INotice borderClass="b-white" pointClass="bg-white">
          {t('create.verification.business.notice')}
        </INotice>

        <div className="fec">
          <Button
            size="large"
            className="bg-transparent! text-white! hover:text-primary-1!"
            loading={isPending}
            onClick={() => createMutate()}
          >
            {t('create.verification.business.continue')}
          </Button>
        </div>
      </div>
    </div>
  )
}
