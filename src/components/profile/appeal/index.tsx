import type { InputRef } from 'antd'
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
  const [complaintType, setComplaintType] = useState('2')
  const [complaintReason, setComplaintReason] = useState('')
  const complaintReasonRef = useRef<InputRef>(null)
  const [fileUrl, setFileUrl] = useState<string[]>([])
  return (
    <div className="appeal">
      <Form layout="vertical">
        <Form.Item name="appeal" label={<div>{t('profile.appeal.appealType.title')}</div>}>
          <Radio.Group options={options} onChange={e => setComplaintType(e.target.value)} value={complaintType} />
        </Form.Item>
        <Form.Item name="appeal" label={<div>{t('profile.appeal.appealReason.title')}</div>}>
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
        <Form.Item name="appeal" label={<div>{t('profile.appeal.uploadEvidence.title')}</div>}>
          <UploadMultifileCard
            className="flex gap-3"
            fileType={'image/*,application/pdf'}
            fileUrl={fileUrl}
            maxLength={3}
            width="300px"
            height="150px"
            // label={t('create.verification.personal.facial')}
            title={t('profile.appeal.uploadEvidence.title')}
            icon={new URL('@/assets/icons/user-circular.svg', import.meta.url).href}
            removeFile={(index) => {
              setFileUrl(fileUrl.filter((_, i) => i !== index))
            }}
            beforeUpload={(file) => {
              setFileUrl([...fileUrl, fileUrl.length < 2
                ? 'https://dev1.usdable.com/storage/default/20250725/3040-1fd5d90f3b9336d3f22f69ca4b56f1a44df56a31e.jpg'
                : URL.createObjectURL(file)])
            }}
          >
          </UploadMultifileCard>
        </Form.Item>
        <Form.Item name="appeal" label={<div>{t('profile.appeal.contactInformation.title')}</div>}>
          <div className="ml-4 w-60% flex flex-col gap-2 [&>div>div]:min-w-80px max-lg:w-full">
            <div className="flex gap-2">
              <div className="">
                {t('profile.appeal.contactInformation.realName')}
                :
              </div>
              <Input placeholder={t('profile.appeal.contactInformation.realNamePlaceholder')} />
            </div>
            <div className="flex gap-2">
              <div>
                {t('profile.appeal.contactInformation.phone')}
                :
              </div>
              <Input placeholder={t('profile.appeal.contactInformation.phonePlaceholder')} />
            </div>
            <div className="flex gap-2">
              <div>
                {t('profile.appeal.contactInformation.email')}
                :
              </div>
              <Input placeholder={t('profile.appeal.contactInformation.emailPlaceholder')} />
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
            <Button>{t('profile.appeal.cancel')}</Button>
            <Button type="primary">{t('profile.appeal.submit')}</Button>
          </div>
        </Form.Item>
      </Form>

    </div>
  )
}
