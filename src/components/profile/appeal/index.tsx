import type { SubmitAppealData } from '@/api/profile'
import type { InputRef } from 'antd'
import apiMyInfoApi from '@/api/apiMyInfoApi'
import { submitAppeal } from '@/api/profile'
import { joinImagePath } from '@/utils/url'
import { useMutation } from '@tanstack/react-query'
import { Button, Form, Input, Radio } from 'antd'
import UploadMultifileCard from '../-components/uploa-multifile-card'
import './index.scss'

export default function Appeal() {
  const { t } = useTranslation()
  const options = [
    { label: <div>{t('profile.appeal.appealType.options.1')}</div>, value: '1' },
    { label: <div>{t('profile.appeal.appealType.options.2')}</div>, value: '2' },
    { label: <div>{t('profile.appeal.appealType.options.3')}</div>, value: '3' }
  ]
  const [complaintType, setComplaintType] = useState('')
  const [complaintReason, setComplaintReason] = useState('')
  const complaintReasonRef = useRef<InputRef>(null)
  const [fileUrl, setFileUrl] = useState<string[]>([])
  const [formData, setFormData] = useState({
    real_name: '',
    contact_phone: '',
    email: ''
  })
  const { mutateAsync: updateFile, isPending: uploadFileLoading } = useMutation({
    mutationFn: async (data: { file: File }) => {
      const formData = new FormData()
      formData.append('file', data.file)
      // debugger
      const res = await apiMyInfoApi.uploadFile(formData)
      return res
    },
    onSuccess: (res) => {
      const url = _get(res.data, 'file.url', '')
      console.log(url, res)
    },
    onError(_error, _variables) {
      toast.error(t('profile.edit.upload_failed'))
    }
  })

  const beforeUpload = (file: File) => {
    updateFile({ file }).then((res) => {
      setFileUrl([...fileUrl, res.data?.file.url || ''])
    })
  }
  const { mutateAsync: userSubmitAppeal, isPending } = useMutation({
    mutationKey: ['submitAppeal'],
    mutationFn: async (data: SubmitAppealData) => {
      return await submitAppeal(data)
    }
  })
  // 提交申诉内容
  const handleSubmit = async () => {
    // 判断申诉内容是否填写
    // 验证邮箱
    const reg = /^[\w.%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i
    if (!complaintType || !complaintReason || !fileUrl || !formData.contact_phone
      || !formData.email || !formData.real_name
    ) {
      toast.error(t('create.verification.personal.upload_error'))
      return
    }
    // 验证邮箱格式
    if (!reg.test(formData.email)) {
      toast.error(t('common.email_format_error'))
      return
    }
    await userSubmitAppeal({
      appeal_type: complaintType,
      appeal_reason: complaintReason,
      proof_files: fileUrl.join(','),
      real_name: formData.real_name,
      contact_phone: formData.contact_phone,
      email: formData.email
    }).then((res) => {
      if (res.code === 1) {
        toast.success(t('profile.appeal.sumbit_success'))
        cancelSumbit()
      }
    })
  }
  // 清除上传信息
  const cancelSumbit = () => {
    setComplaintType('')
    setComplaintReason('')
    setFileUrl([])
    setFormData({
      real_name: '',
      contact_phone: '',
      email: ''
    })
  }

  return (
    <div className="appeal">
      <Form layout="vertical">
        <Form.Item name="complaintType" label={<div>{t('profile.appeal.appealType.title')}</div>}>
          <Radio.Group
            options={options}
            onChange={(e) => {
              setComplaintType(e.target.value)
            }}
            value={complaintType}
            defaultValue={complaintType}
          />
        </Form.Item>
        <Form.Item name="complaintReason" label={<div>{t('profile.appeal.appealReason.title')}</div>}>
          <div
            onClick={() => complaintReasonRef.current?.focus()}
            className="w-60% cursor-text rounded-md bg-#212328 p-4 pb-8 max-lg:w-full"
          >
            <Input.TextArea
              ref={complaintReasonRef}
              className="!b-none !border-none !bg-transparent !shadow-none"
              rows={3}
              maxLength={500}
              showCount
              value={complaintReason}
              onChange={e => setComplaintReason(e.target.value)}
            />
          </div>
        </Form.Item>
        <Form.Item name="fileUrl" label={<div>{t('profile.appeal.uploadEvidence.title')}</div>}>
          <UploadMultifileCard
            className="flex gap-3"
            fileType="image/png,image/jpg,application/pdf"
            fileUrl={fileUrl.map(res => joinImagePath(res))}
            maxLength={3}
            width="300px"
            height="150px"
            loading={uploadFileLoading}
            // label={t('create.verification.personal.facial')}
            title={t('profile.appeal.uploadEvidence.title')}
            icon={new URL('@/assets/icons/user-circular.svg', import.meta.url).href}
            removeFile={(index) => {
              setFileUrl(fileUrl.filter((_, i) => i !== index))
            }}
            beforeUpload={(file) => {
              beforeUpload(file)
            }}
          >
          </UploadMultifileCard>
        </Form.Item>
        <Form.Item name="formData" label={<div>{t('profile.appeal.contactInformation.title')}</div>}>
          <div className="ml-4 w-60% flex flex-col gap-2 [&>div>div]:min-w-80px max-lg:w-full">
            <div className="flex gap-2">
              <div className="">
                {t('profile.appeal.contactInformation.realName')}
                :
              </div>
              <Input value={formData.real_name} onChange={e => setFormData(data => ({ ...data, real_name: e.target.value }))} placeholder={t('profile.appeal.contactInformation.realNamePlaceholder')} />
            </div>
            <div className="flex gap-2">
              <div>
                {t('profile.appeal.contactInformation.phone')}
                :
              </div>
              <Input value={formData.contact_phone} onChange={e => setFormData(data => ({ ...data, contact_phone: e.target.value }))} placeholder={t('profile.appeal.contactInformation.phonePlaceholder')} />
            </div>
            <div className="flex gap-2">
              <div>
                {t('profile.appeal.contactInformation.email')}
                :
              </div>
              <Input value={formData.email} onChange={e => setFormData(data => ({ ...data, email: e.target.value }))} placeholder={t('profile.appeal.contactInformation.emailPlaceholder')} />
            </div>
            {/* <div className="flex gap-2">
            <div>申诉原因:</div>
            <Input placeholder="请输入申诉原因" /></div> */}
          </div>
        </Form.Item>
        <Form.Item name="appeal" label="">
          <div className="">
            <div className="text-4.5">{t('profile.appeal.submitDesc.title')}</div>
            <ul className="m-2 list-decimal list-inside text-3.5 space-y-2">
              <li>{t('profile.appeal.submitDesc.content.1')}</li>
              <li>{t('profile.appeal.submitDesc.content.2')}</li>
              <li>{t('profile.appeal.submitDesc.content.3')}</li>
              <li>{t('profile.appeal.submitDesc.content.4')}</li>
            </ul>
          </div>
          <div className="fcc gap-6">
            <Button onClick={cancelSumbit}>{t('profile.appeal.cancel')}</Button>
            <Button loading={isPending} onClick={handleSubmit} type="primary">{t('profile.appeal.submit')}</Button>
          </div>
        </Form.Item>
      </Form>

    </div>
  )
}
