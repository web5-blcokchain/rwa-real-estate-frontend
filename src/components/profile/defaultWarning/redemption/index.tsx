import type { Dispatch, SetStateAction } from 'react'
import { formatNumberNoRound } from '@/utils/number'
import { Button, Modal } from 'antd'

function RedemptionMoadl({ visibleInfo, redemptionType, message = '', hash = '' }: {
  visibleInfo: [boolean, Dispatch<SetStateAction<boolean>>]
  redemptionType: number
  message?: string
  hash?: string
}) {
  const [visible, setVisible] = visibleInfo
  const { t } = useTranslation()
  const copyText = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success(t('common.copy_success'))
  }

  return (
    <Modal
      title=""
      open={visible}
      onCancel={() => setVisible(false)}
      maskClosable={false}
      className={cn('login-dialog')}
      centered
      footer={() => (<div></div>)}
      width={400}
    >
      <div className="p-4">
        {
          redemptionType === 0
            ? (
                <div className="fccc gap-2 text-center">
                  <div className="i-qlementine-icons:success-16 size-10 bg-white text-base"></div>
                  <div className="text-2xl">{t('profile.warning.redemption.modal.success.title')}</div>
                  <div>{t('profile.warning.redemption.modal.success.content')}</div>
                  <div className="fcc gap-2 rounded-md bg-#212328 px-2 py-1">
                    <div className="flex-1 truncate">0x7c5e8f3d9a1b4c2d6e44329f</div>
                    <div onClick={() => copyText(hash)} className="w-fit cursor-pointer rounded-md bg-#898989 px-4 py-1">{t('common.copy')}</div>
                  </div>
                </div>
              )
            : (
                <div className="fccc gap-2 text-center">
                  <div className="i-codicon:error size-10 bg-white text-base"></div>
                  <div className="text-2xl">{t('profile.warning.redemption.modal.error.title')}</div>
                  <div>{t('profile.warning.redemption.modal.error.content')}</div>
                  <div className="fccc gap-2">
                    <Button type="primary" className="w-full">{t('profile.warning.redemption.modal.error.button')}</Button>
                    <div className="px-3 text-left text-xs text-#6D6C6C [&>div]:w-full">
                      <div>{t('profile.warning.redemption.modal.error.error')}</div>
                      <div>{t(message || 'profile.warning.redemption.modal.error.error_message')}</div>
                    </div>
                  </div>
                </div>
              )
        }
      </div>
    </Modal>
  )
}

export default function WarningRedemptionInfo({ secondaryMenuProps }: { secondaryMenuProps: { id: number } }) {
  const { t } = useTranslation('', {
    keyPrefix: 'profile.warning.redemption'
  })
  const redemptionInfo = [
    {
      title: 'recovery_amount',
      value: `$${formatNumberNoRound(180000)}`
    },
    {
      title: 'rental_income',
      value: `$${formatNumberNoRound(15300000)}`
    },
    {
      title: 'token_price',
      value: `$${formatNumberNoRound(153000)}`
    },
    {
      title: 'token_holdings',
      value: <span>{t('redemption_num', { num: 12 })}</span>
    }
  ]
  const [visible, setVisible] = useState(false)
  const [redemptionType, _setRedemptionType] = useState(0)

  useEffect(() => {
    console.log(secondaryMenuProps)
  }, [])

  return (
    <div>
      <div className="grid grid-cols-4 gap-4 max-md:grid-cols-2">
        {
          redemptionInfo.map((item) => {
            return (
              <div className="rounded-md bg-#202329 p-6 space-y-3" key={item.title}>
                <div className="text-base text-#898989">{t(item.title)}</div>
                <div className="truncate text-2xl text-white" title={item.value as string}>{item.value}</div>
              </div>
            )
          })
        }
      </div>
      <div className="mt-10 text-white space-y-2">
        <div className="text-2xl max-md:text-xl">
          <div>{t('redemption_application')}</div>
          <div>AT20230815-075</div>
          <div>上海市浦东新区世纪大道100号</div>
        </div>
        <div className="text-xl max-md:text-base">
          {t('receive_wallet')}
          ：0x4b3F3d6C8b3e7d1a1C8d3F7a1B9
        </div>
        <div className="text-xl max-md:text-base">
          {t('transaction_hash')}
          ：0x7c5e8f3
        </div>
      </div>
      <div className="mt-35 fcc">
        <Button onClick={() => setVisible(true)} type="primary" size="large" className="text-black">{t('redemption_now')}</Button>
      </div>
      <RedemptionMoadl visibleInfo={[visible, setVisible]} redemptionType={redemptionType} />
    </div>
  )
}
