import type { UploadProps } from 'antd'
import apiMyInfo from '@/api/apiMyInfoApi'
import INotice from '@/components/common/i-notice'
import { UserCode } from '@/enums/user'
import { useUserStore } from '@/stores/user'
import { joinImagePath } from '@/utils/url'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { Button, Upload } from 'antd'
import UploadCard from '../../upload-card'
import './individual.scss'

export default function IndividualVerification() {
  const { t } = useTranslation()
  const { registerData, setCode: setExist, setRegisterData, clearRegisterData } = useUserStore()
  const navigate = useNavigate()

  // 获取身份证正反面图片地址
  const idCardFrontUrl = registerData?.id_card_front_url || ''
  const idCardBackUrl = registerData?.id_card_back_url || ''

  // 获取地址证明和面部照片图片地址
  const addressUrl = registerData?.address_url || ''
  const photoUrl = registerData?.photo_url || ''

  const { mutate: updateFile } = useMutation({
    mutationFn: async (data: { file: File, key: string }) => {
      const formData = new FormData()
      formData.append('file', data.file)
      const res = await apiMyInfo.uploadFile(formData)
      console.log('res', res)
      setRegisterData({
        ...registerData,
        [data.key]: _get(res.data, 'file.url', '')
      })

      return res
    },
    onSuccess: (res) => {
      const url = _get(res.data, 'file.url', '')
      console.log(url)
    }
  })

  const { mutate: createMutate, isPending } = useMutation({
    mutationFn: () => apiMyInfo.register({
      ...registerData
    }),
    onSuccess: () => {
      toast.success(t('create.message.create_success'))
      setExist(UserCode.LoggedIn)
      clearRegisterData()
      navigate({
        to: '/profile'
      })
    }
  })

  const commonProps: UploadProps = {
    showUploadList: false
  }

  const beforeUpload = (file: File, key: string) => {
    updateFile({ file, key })
  }

  const idCardImages = [
    idCardFrontUrl,
    idCardBackUrl
  ]
    .filter(Boolean)
    .map(url => joinImagePath(url))

  return (
    <div className="fccc gap-2">
      <div className="max-w-md text-center text-8 font-medium">{t('create.verification.personal.title')}</div>
      <div className="max-w-md text-center text-4 text-[#898989]">{t('create.verification.personal.subTitle')}</div>

      <div className="mt-8 max-w-lg w-full space-y-6">
        <UploadCard
          label={t('create.verification.personal.identity')}
          title={t('create.verification.personal.upload_title')}
          subTitle={t('create.verification.personal.upload_subTitle')}
          icon={new URL('@/assets/icons/id-card.svg', import.meta.url).href}
          src={idCardImages}
        >
          <div className="grid grid-cols-2 gap-4">
            <Upload
              className="[&>.ant-upload]:(w-full)"
              {...commonProps}
              beforeUpload={file => beforeUpload(file, 'id_card_front_url')}
            >
              <Button type="primary" size="large" className="w-full">
                <div className="fyc gap-2">
                  <span className="i-material-symbols-upload-rounded bg-black text-5"></span>
                  <span className="text-black">{t('create.upload_id_card_front')}</span>
                </div>
              </Button>
            </Upload>
            <Upload
              className="[&>.ant-upload]:(w-full)"
              {...commonProps}
              beforeUpload={file => beforeUpload(file, 'id_card_back_url')}
            >
              <Button type="primary" size="large" className="w-full">
                <div className="fyc gap-2">
                  <span className="i-material-symbols-upload-rounded bg-black text-5"></span>
                  <span className="text-black">{t('create.upload_id_card_back')}</span>
                </div>
              </Button>
            </Upload>
          </div>
        </UploadCard>

        <UploadCard
          label={t('create.verification.personal.poof')}
          title={t('create.verification.personal.proof_title')}
          subTitle={t('create.verification.personal.proof_subTitle')}
          icon={new URL('@/assets/icons/document.svg', import.meta.url).href}
          beforeUpload={(file) => {
            beforeUpload(file, 'address_url')
          }}
          src={joinImagePath(addressUrl)}
        >
        </UploadCard>

        <UploadCard
          label={t('create.verification.personal.facial')}
          title={t('create.verification.personal.facial_title')}
          subTitle={t('create.verification.personal.facial_subTitle')}
          icon={new URL('@/assets/icons/user-circular.svg', import.meta.url).href}
          beforeUpload={(file) => {
            beforeUpload(file, 'photo_url')
          }}
          src={joinImagePath(photoUrl)}
        >
        </UploadCard>

        <INotice borderClass="b-white" pointClass="bg-white">
          {t('create.verification.personal.notice')}
        </INotice>

        <div className="fec">
          <Button
            size="large"
            className="bg-transparent! text-white! hover:text-primary-1!"
            loading={isPending}
            onClick={() => createMutate()}
          >
            {t('create.verification.personal.continue')}
          </Button>
        </div>
      </div>
    </div>
  )
}
