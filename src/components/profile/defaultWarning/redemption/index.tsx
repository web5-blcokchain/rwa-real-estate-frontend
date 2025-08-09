import type { ethers } from 'ethers'
import type { Dispatch, SetStateAction } from 'react'
import { getRedemptionInfo, redemptionWarningAssets } from '@/api/assets'
import { useUserStore } from '@/stores/user'
import { formatNumberNoRound } from '@/utils/number'
import { getPropertyTokenAmount } from '@/utils/web/propertyToken'
import { getRedemptionManagerContract, redemptionWarningAsset } from '@/utils/web/redemptionManager'
import { useWallets } from '@privy-io/react-auth'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Button, Modal } from 'antd'
import { toast } from 'react-toastify'

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
                  <div className="w-full fccc gap-2">
                    <Button type="primary" className="w-full">{t('profile.warning.redemption.modal.error.button')}</Button>
                    <div className="w-full px-3 text-left text-xs text-#6D6C6C [&>div]:w-full">
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

export default function WarningRedemptionInfo({ secondaryMenuProps }:
{ secondaryMenuProps: { id: number, name: string, address: string, contract_address: string, assets_id: number } }) {
  const { t } = useTranslation()

  // 获取赎回信息
  const { data } = useQuery({
    queryKey: ['redemptionInfo', secondaryMenuProps.id],
    queryFn: async () => {
      const data = await getRedemptionInfo(secondaryMenuProps.id)
      return data.data
    }
  })
  const [isRedemption, setIsRedemption] = useState(false)
  const { wallets } = useWallets()
  const [visible, setVisible] = useState(false)
  const [redemptionType, setRedemptionType] = useState(0)
  const { userData } = useUserStore()

  const { mutateAsync, isPending: getRedemptionWarningInfoLoading } = useMutation({
    mutationKey: ['redemptionWarning'],
    mutationFn: async (data: {
      id: string
      price: string
      tx_hash: string
    }) => {
      return await redemptionWarningAssets(data)
    }
  })
  const [modelValue, setModelValue] = useState({
    message: '',
    hash: ''
  })
  const [redemptionLoading, setRedemptionLoading] = useState(false)
  // 赎回资产
  async function redemptionWarningAmount() {
    setRedemptionLoading(true)
    try {
      const wallet = wallets.find(wallet => wallet.walletClientType !== 'privy')
      if (!wallet) {
        toast.error(t('payment_method.please_connect_wallet'))
        return
      }
      // 判断是否连接钱包不对
      if (wallet.address !== userData.wallet_address) {
        toast.warn(t('payment.errors.please_use_bound_wallet'))
        return
      }
      const ethProvider = await wallet.getEthereumProvider()
      const contact = await getRedemptionManagerContract(ethProvider)
      // 操作合约赎回资产
      const { tx, balance } = await redemptionWarningAsset(ethProvider, contact as ethers.Contract, wallet.address, secondaryMenuProps.contract_address)
      if (tx) {
        const res = await mutateAsync({
          id: secondaryMenuProps.assets_id.toString(),
          price: `${balance}`,
          tx_hash: tx.hash
        })
        if (res.code === 1) {
          setIsRedemption(true)
          setRedemptionType(0)
          setModelValue({
            message: '',
            hash: tx.hash
          })
          setVisible(true)
        }
        else {
          throw new Error(res.msg)
        }
      }
      else {
        throw new Error('钱包操作失败')
      }
    }
    catch (e: any) {
      console.error(e)
      setRedemptionType(1)
      setVisible(true)
      setModelValue({
        message: e.message,
        hash: ''
      })
    }
    finally {
      setRedemptionLoading(false)
    }
  }

  const [redemptionInfo, setRedemptionInfo] = useState<{
    title: string
    value: string | React.ReactNode
  }[]>([])
  const [amountLoading, setAmountLoading] = useState(false)
  useEffect(() => {
    const func = async () => {
      setAmountLoading(true)
      // 通过合约获取资产数量
      const wallet = wallets.find(wallet => wallet.walletClientType !== 'privy')
      let amount = 0
      if (!wallet && redemptionInfo.length > 0) {
        setAmountLoading(false)
        return
      }
      else if (wallet) {
        const ethProvider = await wallet.getEthereumProvider()
        amount = await getPropertyTokenAmount(ethProvider, secondaryMenuProps.contract_address, wallet.address)
      }
      setRedemptionInfo([
        {
          title: 'profile.warning.redemption.recovery_amount',
          value: `$${formatNumberNoRound(data?.total_current)}`
        },
        {
          title: 'profile.warning.redemption.rental_income',
          value: `$${formatNumberNoRound(data?.redemption_current)}`
        },
        {
          title: 'profile.warning.redemption.token_price',
          value: `$${formatNumberNoRound(Number(data?.price) * Number(data?.total_number))}`
        },
        {
          title: 'profile.warning.redemption.token_holdings',
          value: <span>{wallet ? t('profile.warning.redemption.redemption_num', { num: amount || 0 }) : '-'}</span>
        }
      ])
      setAmountLoading(false)
    }
    func()
  }, [data, wallets])
  return (
    <div>

      <Waiting className={cn('fcc', amountLoading || getRedemptionWarningInfoLoading ? 'h-120px' : '')} for={!amountLoading || getRedemptionWarningInfoLoading}>
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
      </Waiting>

      <div className="mt-10 text-white space-y-2">
        <div className="text-2xl max-md:text-xl">
          <div>{t('profile.warning.redemption.redemption_application')}</div>
          <div>{secondaryMenuProps.name}</div>
          <div>{secondaryMenuProps.address}</div>
        </div>
        <div className="text-xl max-md:text-base">
          {t('profile.warning.redemption.receive_wallet')}
          ：
          {userData.wallet_address}
        </div>
        {/* <div className="text-xl max-md:text-base">
          {t('profile.warning.redemption.transaction_hash')}
          ：0x7c5e8f3
        </div> */}
      </div>
      <div className="mt-35 fcc">
        <Button disabled={isRedemption} loading={redemptionLoading} onClick={() => redemptionWarningAmount()} type="primary" size="large" className="text-black">{t('profile.warning.redemption.redemption_now')}</Button>
      </div>
      <RedemptionMoadl message={modelValue.message} hash={modelValue.hash} visibleInfo={[visible, setVisible]} redemptionType={redemptionType} />
    </div>
  )
}
