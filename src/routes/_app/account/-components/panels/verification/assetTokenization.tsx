import type { RegisterParams } from '@/api/apiMyInfoApi'
import apiMyInfo, { getAssetType } from '@/api/apiMyInfoApi'
import { AccountType } from '@/enums/create-account'
import { UserCode } from '@/enums/user'
import { useUserStore } from '@/stores/user'
import { verifyStr } from '@/utils'
import { joinImagePath } from '@/utils/url'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { Button, Input, InputNumber, Select } from 'antd'
import { VisibleType } from '.'
import UploadCard from '../../upload-card'
import './assetTokenization.scss'

interface AssetTokenizationFormProps {
  className?: string
  title: string | React.ReactNode
  formContent: string | React.ReactNode
}
function AssetTokenizationForm({ title, formContent, className }: AssetTokenizationFormProps) {
  const [isSelected, setIsSelected] = useState(false)
  const formItem = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const inputEl = formItem.current?.querySelector('input')
    const selectedInput = () => setIsSelected(true)
    const unSelectedInput = () => setIsSelected(false)
    if (inputEl) {
      inputEl.addEventListener('focus', selectedInput)
      inputEl.addEventListener('blur', unSelectedInput)
    }
    return () => {
      inputEl?.removeEventListener('focus', selectedInput)
      inputEl?.removeEventListener('blur', unSelectedInput)
    }
  }, [formItem])
  return (
    <div className={cn(className, 'space-y-2')}>
      <div className="text-lg max-md:text-base">{title}</div>
      <div
        ref={formItem}
        className={cn(`bg-#242933 rounded-md overflow-hidden px-4 py-2 text-lg 
    max-md:text-base b-1 asset-tokenization-form-item transition-all-300 leading-8`, isSelected ? 'b-primary' : 'b-#334154')}
      >
        {formContent}
      </div>
    </div>
  )
}
export default function AssetTokenization({ setCurrentVisible }: { setCurrentVisible: (visible: VisibleType) => void }) {
  const { t, i18n } = useTranslation()

  const { data: assetType } = useQuery({
    queryKey: ['assetType'],
    queryFn: async () => {
      const data = await getAssetType()
      return data.data
    }
  })
  const { setCode: setExist, clearRegisterData, getUserInfo, userData, registerData, setRegisterData } = useUserStore()
  const navigate = useNavigate()
  const verifyUpload = () => {
    if (!verifyStr(registerData?.username) || !verifyStr(registerData?.id_number)
      || !verifyStr(registerData?.mobile) || !verifyStr(registerData?.wallet_address)
      || !registerData?.property_type || !registerData?.area || !registerData?.appraisement || !registerData?.prove_url) {
      toast.error(t('create.verification.personal.upload_error'))
      return false
    }
    if (!verifyStr(registerData.wallet_address, {
      pattern: /^0x[a-fA-F0-9]{40}$/,
      min: 42,
      max: 42
    })) {
      toast.error(t('create.verification.asset_tokenization_content.error.wallet_address_error'))
      return false
    }
    return true
  }
  const sumbitData = (): RegisterParams => ({
    // ...registerData
    type: AccountType.AssetTokenization,
    username: registerData.username,
    id_number: registerData.id_number,
    mobile: registerData.mobile,
    wallet_address: registerData.wallet_address,
    property_type: registerData.property_type,
    area: registerData.area,
    appraisement: registerData.appraisement,
    prove_url: registerData.prove_url,
    email: registerData.email,
    token: registerData?.token
  })
  const { mutate: createMutate, isPending: sumbitLoading } = useMutation({
    mutationFn: () => apiMyInfo.register({ ...sumbitData() }),
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
  //  clearRegisterData()
  const { mutate: reloadCreateMutate, isPending: reloadCreatePending } = useMutation({
    mutationFn: () => apiMyInfo.submitInfo({ ...sumbitData() }),
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

  const contentForm: AssetTokenizationFormProps[] = useMemo(() => {
    const selectList = assetType?.map(item => ({ label: <div>{item.name}</div>, value: item.id })) || []
    return [
      {
        title: <div>{t('create.verification.asset_tokenization_content.form.name')}</div>,
        formContent: (
          <div>
            <Input
              placeholder={t('create.verification.asset_tokenization_content.form.name_placeholder')}
              value={registerData?.username}
              onChange={e => setRegisterData({ username: e.target.value })}
            />
          </div>
        )
      },
      {
        title: <div>{t('create.verification.asset_tokenization_content.form.id_number')}</div>,
        formContent: (
          <div>
            <Input
              placeholder={t('create.verification.asset_tokenization_content.form.id_number_placeholder')}
              value={registerData?.id_number}
              onChange={e => setRegisterData({ id_number: e.target.value })}
            />
          </div>
        )
      },
      {
        title: <div>{t('create.verification.asset_tokenization_content.form.phone')}</div>,
        formContent: (
          <div>
            <Input
              size="middle"
              placeholder={t('create.verification.asset_tokenization_content.form.phone_placeholder')}
              value={registerData?.mobile}
              onChange={e => setRegisterData({ mobile: e.target.value })}
            />
          </div>
        )
      },
      {
        title: <div>{t('create.verification.asset_tokenization_content.form.asset_address')}</div>,
        formContent: (
          <div>
            <Select
              placeholder={t('create.verification.asset_tokenization_content.form.asset_address_placeholder')}
              size="middle"
              className={cn(
                '[&_.ant-select-selector]:(bg-transparent! text-white!)',
                '[&_.ant-select-selection-placeholder]:(text-[#898989]!)',
                '[&_.ant-select-selection-item]:(bg-transparent! text-white!)',
                '[&_.ant-select-arrow]:(text-white!)'
              )}
              options={selectList}
              value={registerData.property_type}
              onChange={e => setRegisterData({ property_type: e })}
            />
          </div>
        )
      },
      {
        title: <div>{t('create.verification.asset_tokenization_content.form.house_area')}</div>,
        formContent: (
          <div>
            <InputNumber
              controls={false}
              placeholder={t('create.verification.asset_tokenization_content.form.house_area_placeholder')}
              value={registerData?.area}
              onChange={e => setRegisterData({ area: e || 0 })}
            />
          </div>
        )
      },
      {
        title: <div>{t('create.verification.asset_tokenization_content.form.estimated_value')}</div>,
        formContent: (
          <div>
            <InputNumber
              controls={false}
              placeholder={t('create.verification.asset_tokenization_content.form.estimated_value_placeholder')}
              value={registerData?.appraisement}
              onChange={e => setRegisterData({ appraisement: e || 0 })}
            />
          </div>
        )
      }
    ]
  }, [assetType, i18n.language, registerData])

  const { mutateAsync: updateFile, isPending } = useMutation({
    mutationFn: async (data: { file: File, key: string }) => {
      const formData = new FormData()
      formData.append('file', data.file)
      // debugger
      const res = await apiMyInfo.uploadFile(formData)
      setRegisterData({
        // ...registerData,
        [data.key]: _get(res.data, 'file.url', '')
      })
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

  const beforeUpload = (file: File, key: string) => {
    updateFile({ file, key })
  }

  return (
    <div className="mx-auto w-full fccc gap-2 px-30% max-lg:px-0 max-xl:px-25%">
      <div className="w-full fyc gap-1 clickable" onClick={() => setCurrentVisible(VisibleType.Select)}>
        <div className="i-material-symbols:arrow-back-rounded size-7 bg-white"></div>
        <div>返回</div>
      </div>
      <div className="max-md:text-2x text-center text-center text-8 font-medium max-md:mt-3">{t('create.verification.asset_tokenization_content.title')}</div>
      <div className="max-w-md text-center text-4 text-[#898989] max-md:text-sm">{t('create.verification.asset_tokenization_content.title_desc')}</div>
      <div className="mt-8 w-full pt-8">
        <div>
          <div className="max-lg:text-baae mb-7 b-b-1 b-#242933 pb-5 text-xl font-bold max-lg:mb-4 max-lg:pb-4">{t('create.verification.asset_tokenization_content.subTitle')}</div>
          <div className="grid grid-cols-2 gap-x-10 gap-y-10 max-lg:grid-cols-1 max-lg:gap-y-6">
            {
              contentForm.map((res, index) => (
                <AssetTokenizationForm
                  key={index}
                  title={res.title}
                  className={res.className}
                  formContent={res.formContent}
                />
              ))
            }
          </div>
        </div>
        <div className="mt-16 max-lg:mt-12">
          <div className="max-lg:text-baae mb-7 b-b-1 b-#242933 pb-5 text-xl font-bold max-lg:mb-4 max-lg:pb-4">{t('create.verification.asset_tokenization_content.bind_wallet')}</div>
          <div className="grid grid-cols-2 gap-x-10 gap-y-10 max-lg:grid-cols-1 max-lg:gap-y-6">
            <AssetTokenizationForm
              title={t('create.verification.asset_tokenization_content.form.wallet_address')}
              className=""
              formContent={(
                <div>
                  <Input
                    placeholder={t('create.verification.asset_tokenization_content.form.wallet_address_placeholder')}
                    value={registerData?.wallet_address}
                    onChange={e => setRegisterData({ wallet_address: e.target.value })}
                  />
                </div>
              )}
            />
          </div>
          <div className="mt-2 text-xs text-#a7a9ad">{t('create.verification.asset_tokenization_content.hint')}</div>
          <div className="mt-10">
            <div className="mb-2 mt-10 text-lg max-md:text-base">{t('create.verification.asset_tokenization_content.form.asset_documents')}</div>
            <UploadCard
              loading={isPending}
              label=""
              title={t('create.verification.asset_tokenization_content.upload.title')}
              subTitle={t('create.verification.asset_tokenization_content.upload.label')}
              icon={new URL('@/assets/icons/document.svg', import.meta.url).href}
              accept="image/png,image/jpg,application/pdf"
              beforeUpload={(file) => {
                beforeUpload(file, 'prove_url')
              }}
              src={joinImagePath(registerData.prove_url || '')}
            >
            </UploadCard>
          </div>
        </div>
        <div className="mt-12 flex justify-end">
          <Button
            size="large"
            className={cn('max-md:text-sm !text-black !bg-#e7bb41')}
            loading={sumbitLoading || reloadCreatePending}
            onClick={() => {
              if (verifyUpload()) {
                // 判断是不是拒绝之后重新申请的
                if (userData.audit_status && (userData.audit_status === 2 || userData.audit_status === 4)) {
                  reloadCreateMutate()
                }
                else {
                  createMutate()
                }
              }
            }}
          >
            {t('create.verification.asset_tokenization_content.form.submit')}
          </Button>
        </div>
      </div>
    </div>
  )
}
