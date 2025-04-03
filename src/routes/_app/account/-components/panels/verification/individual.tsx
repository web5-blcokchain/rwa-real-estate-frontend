import type { UploadProps } from 'antd'
import { _useStore as useStore } from '@/_store/_userStore'
import apiMyInfo from '@/api/apiMyInfoApi'
import INotice from '@/components/common/i-notice'
import { useMutation } from '@tanstack/react-query'
import { Button, Upload } from 'antd'
import UploadCard from '../../upload-card'

import './individual.scss'

export default function IndividualVerification() {
  const { t } = useTranslation()
  const setRegisterData = useStore(state => state.setRegisterData)
  const RegisterData = useStore(state => state.registerData)

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

  const props: UploadProps = {
    showUploadList: false
  }

  const beforeUpload = (file: File, key: string) => {
    updateFile({ file, key })
  }

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
        >
          <div className="grid grid-cols-2 gap-4">
            <Button type="primary" size="large">
              <div className="fyc gap-2">
                <span className="i-material-symbols-photo-camera-rounded bg-black text-5"></span>
                <span className="text-black">{t('create.verification.personal.photo')}</span>
              </div>
            </Button>
            <Upload {...props} beforeUpload={file => beforeUpload(file, 'id_card_front_url')}>
              <Button type="primary" size="large">
                <div className="fyc gap-2">
                  <span className="i-mdi-folder-open bg-black text-5"></span>
                  <span className="text-black">{t('create.verification.personal.files')}</span>
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
        >
        </UploadCard>

        <INotice borderClass="b-white" pointClass="bg-white">
          {t('create.verification.personal.notice')}
        </INotice>

        <div className="fec">
          <Button size="large" className="bg-transparent! text-white! hover:text-primary-1!" onClick={() => createMutate()}>
            {t('create.verification.personal.continue')}
          </Button>
        </div>
      </div>
    </div>
  )
}
