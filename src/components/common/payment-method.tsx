import type { ConnectedWallet } from '@privy-io/react-auth'
import type { Dispatch, SetStateAction } from 'react'
import { useUserStore } from '@/stores/user'
import { useWallets } from '@privy-io/react-auth'

export const PaymentMethod: FC<{
  walletState: [ConnectedWallet | null, Dispatch<SetStateAction<ConnectedWallet | null>>]
} & React.HTMLAttributes<HTMLDivElement>> = ({
  walletState,
  className
}) => {
  const { ready, wallets } = useWallets()
  const { userData } = useUserStore()
  const { t } = useTranslation()

  const [selectedWallet, setSelectedWallet] = walletState

  useEffect(() => {
    if (!userData.wallet_address) {
      return
    }

    const wallet = wallets.find(wallet => wallet.address === userData.wallet_address)
    if (wallet) {
      setSelectedWallet(wallet)
    }
    else {
      setSelectedWallet(null)
    }
  }, [userData, wallets])

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
          selectedWallet
            ? (
                <div className="fbc">
                  <div>{t('payment_method.user_bound_wallet')}</div>
                  <div>
                    <div className="fyc gap-2">
                      <div className="size-5">
                        {
                          selectedWallet.meta.icon
                            ? (
                                <img src={selectedWallet.meta.icon} alt={selectedWallet.meta.name} />
                              )
                            : (
                                <div className="i-mingcute-wallet-4-fill size-full bg-white" />
                              )
                        }
                      </div>
                      <div>{selectedWallet.meta.name}</div>
                      <div className="text-3.5 text-[#898989]">{selectedWallet.address}</div>
                    </div>
                  </div>
                </div>
              )
            : (
                <div className="fbc">
                  <div className="text-red">{t('payment_method.not_connected_wallet')}</div>
                  <div className="text-3.5 text-[#898989]">{userData.wallet_address}</div>
                </div>
              )

        }
      </Waiting>
    </div>
  )
}
