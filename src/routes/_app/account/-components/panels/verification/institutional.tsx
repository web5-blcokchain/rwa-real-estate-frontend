import apiMyInfo from '@/api/apiMyInfoApi'
import INotice from '@/components/common/i-notice'
import { UserCode } from '@/enums/user'
import { useUserStore } from '@/stores/user'
import { joinImagePath } from '@/utils/url'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { Button } from 'antd'
import { useTranslation } from 'react-i18next'
import { VisibleType } from '.'
import UploadCard from '../../upload-card'
import './individual.scss'

export default function InstitutionalVerification({ setCurrentVisible }: { setCurrentVisible: (visible: VisibleType) => void }) {
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
      setCardLoading(prev => ({
        ...prev,
        [data.key]: true
      }))
      const res = await apiMyInfo.uploadFile(formData)
      setCardLoading(prev => ({
        ...prev,
        [data.key]: false
      }))
      setRegisterData({
        // ...registerData,
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
    // 判读当前用户是否是二次认证，并且第一次是KYC
    if (userData.audit_status && userData.audit_status === 2 && userData.type === 1) {
      toast.error(t('create.verification.personal.upload_error_user'))
      return false
    }
    return true
  }

  const beforeUpload = (file: File, key: string) => {
    updateFile({ file, key })
  }

  return (
    <div className="mx-auto w-fit fccc gap-2">
      <div className="w-full fyc gap-1 clickable" onClick={() => setCurrentVisible(VisibleType.Select)}>
        <div className="i-material-symbols:arrow-back-rounded size-7 bg-white"></div>
        <div>返回</div>
      </div>
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
            className="!b-#e7bb41 bg-transparent! !text-black"
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
            {t('create.verification.personal.upload')}
          </Button>
        </div>
      </div>
    </div>
  )
}
