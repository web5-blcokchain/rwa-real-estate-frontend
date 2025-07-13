import type { ConnectedWallet } from '@privy-io/react-auth'
import type { Dispatch, SetStateAction } from 'react'
import { bindWallet } from '@/api/profile'
import { useUserStore } from '@/stores/user'
import { ensurePrivyNetwork } from '@/utils/privy'
import { useWallets } from '@privy-io/react-auth'

export const PaymentMethod: FC<{
  walletState: [ConnectedWallet | null, Dispatch<SetStateAction<ConnectedWallet | null>>]
} & React.HTMLAttributes<HTMLDivElement>> = ({
  walletState,
  className
}) => {
  const { ready, wallets } = useWallets()
  const { userData, setUserData } = useUserStore()
  const { t } = useTranslation()

  const [_selectedWallet, setSelectedWallet] = walletState
  // const {} = use

  useEffect(() => {
    if (!userData.wallet_address) {
      return
    }

    const wallet = wallets.find(wallet => wallet.walletClientType !== 'privy')
    if (wallet) {
      setSelectedWallet(wallet)
      ensurePrivyNetwork(wallet)
    }
    else {
      setSelectedWallet(null)
    }
  }, [userData, wallets])

  const [bindWalletLoading, setBindWalletLoading] = useState(false)
  // const isConnectedWallet = wallets.some(wallet => wallet.walletClientType !== "privy")
  // 获取当前链接的钱包

  // 绑定钱包
  const handleBindWallet = () => {
    // navigate({ to: '/profile/bind-wallet' })
    const wallet = wallets.find(wallet => wallet.walletClientType !== 'privy')

    if (!wallet) {
      toast.warning(t('payment_method.please_connect_wallet'))
      return
    }
    setBindWalletLoading(true)
    bindWallet({ wallet_address: wallet.address }).then((res) => {
      if (res.code === 200) {
        toast.success(t('create.wallet.bind_wallet_success'))
        setUserData({
          ...userData,
          wallet_address: wallet.address
        })
      }
    })
    setBindWalletLoading(false)
  }

  return (
    <div className={cn(
      'rounded-md bg-[#333947] p-2',
      className
    )}
    >
      <Waiting
        for={ready}
        className="fcc"
      >
        {
          userData.wallet_address
            ? (
                <div className="fbc">
                  <div className="text-red">{t('payment_method.bind_wallet_success')}</div>
                  <div className="text-3.5 text-[#898989]">{userData.wallet_address}</div>
                </div>
              )
            : (
                <div className="fbc">
                  <div className="text-red">{t('payment_method.not_connected_wallet')}</div>
                  {/* <div className="text-3.5 text-[#898989]">{userData.wallet_address}</div> */}
                  {
                    bindWalletLoading
                      ? (
                          <div className="fyc">
                            <div>{t('payment_method.bind_wallet_loading')}</div>
                            <div className="i-line-md-loading-loop bg-white"></div>
                          </div>
                        )
                      : (
                          <div className="cursor-pointer text-3.5 text-[#898989]" onClick={handleBindWallet}>点击绑定钱包</div>
                        )
                  }
                </div>
              )

        }
      </Waiting>
    </div>
  )
}
