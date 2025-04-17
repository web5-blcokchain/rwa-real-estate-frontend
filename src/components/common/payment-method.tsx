import type { ConnectedWallet } from '@privy-io/react-auth'
import type { Dispatch, SetStateAction } from 'react'
import { useWallets } from '@privy-io/react-auth'

export const PaymentMethod: FC<{
  walletState: [ConnectedWallet | null, Dispatch<SetStateAction<ConnectedWallet | null>>]
}> = ({
  walletState
}) => {
  const { ready, wallets } = useWallets()

  const [selectedWallet, setSelectedWallet] = walletState

  return (
    <Waiting for={ready}>
      <div className="flex flex-col gap-2">
        <div className="text-sm text-gray-500">Select Payment Method</div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {wallets.map(wallet => (
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
              <span className="text-3.5 text-[#898989]">{wallet.address}</span>
            </div>
          ))}
        </div>
      </div>
    </Waiting>
  )
}
