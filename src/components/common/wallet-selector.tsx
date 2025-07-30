import type { ConnectedWallet } from '@privy-io/react-auth'
import type { Dispatch, SetStateAction } from 'react'
import { useWallets } from '@privy-io/react-auth'

export const WalletSelector: FC<{
  walletState: [ConnectedWallet | null, Dispatch<SetStateAction<ConnectedWallet | null>>]
  walletListState?: [ConnectedWallet[], Dispatch<SetStateAction<ConnectedWallet[]>>]
  title?: string
}> = ({
  walletState,
  walletListState,
  title
}) => {
  const { ready, wallets } = useWallets()

  const [selectedWallet, setSelectedWallet] = walletState

  const [localWalletList, setLocalWalletList] = useState<ConnectedWallet[]>([])
  const [walletList, setWalletList] = walletListState ?? [localWalletList, setLocalWalletList]

  useEffect(() => {
    if (wallets.length === 0) {
      return
    }

    const allowWallets = wallets.filter((wallet) => {
      return wallet.connectorType !== 'embedded'
    })

    if (allowWallets.length === 0) {
      return
    }

    setWalletList(allowWallets)

    setSelectedWallet(allowWallets[0])
  }, [wallets])

  return (
    <Waiting for={ready}>
      <div className="flex flex-col gap-2">
        <div className="text-sm text-gray-500">{title}</div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {walletList.map(wallet => (
            <div
              key={wallet.address}
              className={cn(
                'flex flex-col items-center gap-2 p-4',
                'b b-background b-solid rounded-md',
                'bg-[#333947] select-none clickable-99',
                selectedWallet?.address === wallet.address ? 'b-primary' : ''
              )}
              onClick={() => {
                setSelectedWallet(wallet)
              }}
            >
              <div className="size-8">
                {
                  wallet.meta.icon
                    ? (
                        <img src={wallet.meta.icon} alt={wallet.meta.name} />
                      )
                    : (
                        <div className="i-mingcute-wallet-4-fill size-full bg-white" />
                      )
                }
              </div>
              <span>{wallet.meta.name}</span>
              <span className="truncate text-3.5 text-[#898989] max-lg:w-full">{wallet.address}</span>
            </div>
          ))}
        </div>
      </div>
    </Waiting>
  )
}
