import type { AssetsWarningList } from '@/api/assets'
import type { ethers } from 'ethers'
import type { Dispatch, SetStateAction } from 'react'
import { getRedemptionInfo, redemptionWarningAssets } from '@/api/assets'
import { useUserStore } from '@/stores/user'
import { formatNumberNoRound } from '@/utils/number'
import { joinImagesPath } from '@/utils/url'
import { getPropertyTokenAmount } from '@/utils/web/propertyToken'
import { getRedemptionManagerContract, getTokenPriceAndRedemption, redemptionWarningAsset } from '@/utils/web/redemptionManager'
import { useWallets } from '@privy-io/react-auth'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Button, Divider, Modal } from 'antd'
import dayjs from 'dayjs'
import { toast } from 'react-toastify'

function RedemptionMoadl({ visibleInfo, redemptionType, message = '', hash = '', reloadRedemption }: {
  visibleInfo: [boolean, Dispatch<SetStateAction<boolean>>]
  redemptionType: number
  message?: string
  hash?: string
  reloadRedemption: () => void
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
                    <Button onClick={() => reloadRedemption()} type="primary" className="w-full">{t('profile.warning.redemption.modal.error.button')}</Button>
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
{ secondaryMenuProps: AssetsWarningList }) {
  const { t } = useTranslation()

  // 获取赎回信息
  const { data, isFetching: getRedemptionWarningInfoLoading } = useQuery({
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

  const { mutateAsync } = useMutation({
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
  const [redemptionContract, setRedemptionContract] = useState<ethers.Contract>()
  useEffect(() => {
    const func = async () => {
      const wallet = wallets.find(wallet => wallet.walletClientType !== 'privy')
      if (!wallet) {
        return
      }
      const ethProvider = await wallet.getEthereumProvider()
      const contact = await getRedemptionManagerContract(ethProvider)
      setRedemptionContract(contact as ethers.Contract)
    }
    func()
  }, [wallets])
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
      const contact = redemptionContract
      // 操作合约赎回资产
      const { tx, balance } = await redemptionWarningAsset(ethProvider, contact as ethers.Contract, wallet.address, secondaryMenuProps.contract_address)
      if (tx) {
        const res = await mutateAsync({
          id: secondaryMenuProps.properties_id.toString(),
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
        throw new Error('400002') // 钱包操作失败
      }
    }
    catch (e: any) {
      let message = ''
      if (e.message === '400001') { // 用户取消操作
        message = t('profile.warning.redemption.modal.error.error_message_400001')
        // return
      }
      else {
        message = t('profile.warning.redemption.modal.error.error_message_400002')
      }
      console.error(e)
      setRedemptionType(1)
      setVisible(true)
      setModelValue({
        message,
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
  const [amountLoading, setAmountLoading] = useState(0)
  useEffect(() => {
    const func = async () => {
      // 通过合约获取资产数量
      const wallet = wallets.find(wallet => wallet.walletClientType !== 'privy')
      let amount = 0
      let price = 0
      let tokenPrice = 0
      let oldTokenPrice = 1
      if (!wallet && redemptionInfo.length > 0) {
        setAmountLoading(amountLoading + 1)
        return
      }
      else if (wallet) {
        const ethProvider = await wallet.getEthereumProvider()
        amount = await getPropertyTokenAmount(ethProvider, secondaryMenuProps.contract_address, wallet.address)
        if (redemptionContract) {
          const tx = await getTokenPriceAndRedemption(ethProvider, redemptionContract, {
            propertyToken: secondaryMenuProps.contract_address,
            userTokenAmount: amount
          })
          price = tx.netRedemptionAmount
          tokenPrice = tx.nowCurrentPrice
          oldTokenPrice = tx.currentPrice
        }
      }
      setRedemptionInfo([
        {
          title: 'profile.warning.redemption.recovery_amount',
          value: `$${formatNumberNoRound((amount || 0) * oldTokenPrice, 8)}`
        },
        {
          title: 'profile.warning.redemption.rental_income',
          value: `$${formatNumberNoRound(price, 8)}`
        },
        {
          title: 'profile.warning.redemption.token_price',
          value: `$${formatNumberNoRound(tokenPrice, 8)}`
        },
        {
          title: 'profile.warning.redemption.token_holdings',
          value: <span>{wallet ? t('profile.warning.redemption.redemption_num', { num: amount || 0 }) : '-'}</span>
        }
      ])
      setAmountLoading(amountLoading + 1)
    }
    func()
  }, [data, wallets])

  return (
    <div>

      <Waiting className={cn('fcc', amountLoading === 0 || getRedemptionWarningInfoLoading ? 'h-120px' : '')} for={!(amountLoading === 0 || getRedemptionWarningInfoLoading)}>
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

      <div className="mt-10 text-white">
        <div className="fyc gap-4">
          <img
            className="size-100px rounded-md"
            src={joinImagesPath(secondaryMenuProps.image_urls)[0]}
            alt=""
          />
          <div className="text-xl max-md:text-xl">
            <div className="truncate text-3xl max-md:text-2xl">{secondaryMenuProps.name}</div>
            <div className="line-clamp-2 max-md:text-base">{secondaryMenuProps.address}</div>
          </div>
        </div>
        <div className="mt-6 truncate text-base max-md:text-base">
          {t('profile.warning.redemption.receive_wallet')}
          ：
          {userData.wallet_address}
        </div>
        <div className="mt-2 truncate text-base max-md:text-base">
          {t('profile.data_count.transaction_hash')}
          :
          {modelValue.hash}
        </div>
        {/* <div className="text-xl max-md:text-base">
          {t('profile.warning.redemption.transaction_hash')}
          ：0x7c5e8f3
        </div> */}
      </div>
      <Divider className="my-4" />
      <div>
        <div className="text-2xl">{t('profile.warning.redemption.breachDetails')}</div>
        <div className="mt-4 text-base text-base space-y-3">
          <div>
            {t('profile.warning.redemption.breachType')}
            ：
            {t('profile.warning.redemption.rentPaymentBreach')}
          </div>
          <div>
            {t('profile.warning.redemption.breachTime')}
            ：
            {dayjs(secondaryMenuProps.rent_due_date).format('YYYY-MM-DD')}
          </div>
          <div>
            {t('profile.warning.redemption.overdueAmount')}
            ：
            {Math.max(dayjs(secondaryMenuProps.rent_due_date).diff(dayjs(), 'month'), 1) * Number(secondaryMenuProps.monthly_rent)}
          </div>
          <div>
            {t('profile.warning.redemption.breachDuration')}
            ：
            {dayjs().diff(dayjs(secondaryMenuProps.rent_due_date), 'day') + t('common.day')}
          </div>
        </div>
      </div>
      <div className="mt-4 rounded-md bg-#2c2e30 p-4 text-base text-#767678">
        <div>
          {t('profile.warning.redemption.breachReason')}
          {t('profile.warning.redemption.breachDescription')}
        </div>
      </div>
      <div className="mt-35 fcc">
        <Button disabled={isRedemption} loading={redemptionLoading} onClick={() => redemptionWarningAmount()} type="primary" size="large" className="text-black">{t('profile.warning.redemption.redemption_now')}</Button>
      </div>
      <RedemptionMoadl
        reloadRedemption={() => {
          setVisible(false)
          redemptionWarningAmount()
        }}
        message={modelValue.message}
        hash={modelValue.hash}
        visibleInfo={[visible, setVisible]}
        redemptionType={redemptionType}
      />
    </div>
  )
}
