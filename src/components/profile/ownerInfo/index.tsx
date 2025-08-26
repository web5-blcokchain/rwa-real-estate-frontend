import { getAssetType } from '@/api/apiMyInfoApi'
import { useUserStore } from '@/stores/user'
import { useQuery } from '@tanstack/react-query'

export function OwnerInfo() {
  const { t } = useTranslation()

  const { data: assetType } = useQuery({
    queryKey: ['assetType'],
    queryFn: async () => {
      const data = await getAssetType()
      return data.data
    }
  })
  const { userData } = useUserStore()
  const userInfo = useMemo(() => {
    const assestAddress = assetType?.find(res => res.id === userData.property_type)
    return [
      { title: 'create.verification.asset_tokenization_content.form.name', value: userData.nickname },
      { title: 'create.verification.asset_tokenization_content.form.id_number', value: '张三' },
      { title: 'create.verification.asset_tokenization_content.form.phone', value: userData.mobile },
      { title: 'create.verification.asset_tokenization_content.form.asset_address', value: assestAddress?.name },
      { title: 'create.verification.asset_tokenization_content.form.estimated_value', value: userData.area },
      { title: 'create.verification.asset_tokenization_content.form.estimated_value', value: userData.appraisement }
    ]
  }, [userData, assetType])

  return (
    <div>
      <div className="text-2xl text-white">个人信息</div>
      <div className="grid grid-cols-2 mt-10 gap-x-3 gap-y-5 text-base">
        {
          userInfo.map((item, index) => {
            return (
              <div key={index} className="fyc gap-x-4">
                <div className="text-#898989">{t(item.title)}</div>
                <div className="text-white">{item.value}</div>
              </div>
            )
          })
        }
      </div>
      <div className="mt-10 text-2xl text-white">钱包信息</div>
      <div className="mt-10 fyc gap-x-4">
        <div className="text-#898989">{t('钱包地址')}</div>
        <div className="text-white">{userData.wallet_address}</div>
      </div>
    </div>
  )
}
