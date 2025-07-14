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
  const { registerData, setRegisterData, setCode: setExist, clearRegisterData, getUserInfo, userData } = useUserStore()
  const navigate = useNavigate()

  // 获取各种文档的URL
  const businessRegistrationUrl = registerData?.business_registration_document || ''
  const shareholderStructureUrl = registerData?.shareholder_structure_url || ''
  const legalRepresentativeUrl = registerData?.legal_representative_documents_url || ''
  const financialDocumentsUrl = registerData?.financial_documents_url || ''

  const [cardLoading, setCardLoading] = useState({
    business_registration_document: false,
    shareholder_structure_url: false,
    legal_representative_documents_url: false,
    financial_documents_url: false
  })

  const { mutateAsync: updateFile } = useMutation({
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
    onError(_error, variables) {
      setCardLoading(prev => ({
        ...prev,
        [variables.key]: false
      }))
      toast.error(t('profile.edit.upload_failed'))
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
      getUserInfo()
      setExist(UserCode.LoggedIn)
      clearRegisterData()
      navigate({
        to: '/home'
      })
    }
  })
  const { mutate: reloadCreateMutate, isPending: reloadCreatePending } = useMutation({
    mutationFn: () => apiMyInfo.submitInfo({
      ...registerData
    }),
    onSuccess: () => {
      toast.success(t('create.message.reload_success'))
      getUserInfo()
      setExist(UserCode.LoggedIn)
      clearRegisterData()
      navigate({
        to: '/home'
      })
    }
  })

  // 验证上传资料
  const verifyUpload = () => {
    if (!businessRegistrationUrl || !shareholderStructureUrl || !legalRepresentativeUrl || !financialDocumentsUrl) {
      toast.error(t('create.verification.personal.upload_error'))
      return false
    }
    return true
  }

  const beforeUpload = (file: File, key: string) => {
    setCardLoading({
      ...cardLoading,
      [key]: true
    })
    updateFile({ file, key }).then(() => {
      setCardLoading({
        ...cardLoading,
        [key]: false
      })
    })
  }

  return (
    <div className="fccc gap-2">
      <div className="max-w-md text-center text-8 font-medium">{t('create.verification.business.title')}</div>
      <div className="max-w-md text-center text-4 text-[#898989]">{t('create.verification.business.subTitle')}</div>

      <div className="mt-8 max-w-lg w-full space-y-6">
        <UploadCard
          loading={cardLoading.business_registration_document}
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
          loading={cardLoading.shareholder_structure_url}
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
          loading={cardLoading.legal_representative_documents_url}
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
          loading={cardLoading.financial_documents_url}
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
            loading={isPending || reloadCreatePending}
            onClick={() => {
              if (verifyUpload()) {
                if (userData.audit_status && userData.audit_status === 2) {
                  reloadCreateMutate()
                }
                else {
                  createMutate()
                }
              }
            }}
          >
            {t('create.verification.business.continue')}
          </Button>
        </div>
      </div>
    </div>
  )
}
