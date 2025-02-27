interface Wallet {
  name: string
  icon: string
  description: string
}

export default function ConnectWalletPanel() {
  const wallets: Wallet[] = [
    {
      name: 'MetaMask',
      icon: '/assets/icons/meta-mask.svg',
      description: 'Connect to your MetaMask wallet'
    },
    {
      name: 'WalletConnect',
      icon: '/assets/icons/wallet.svg',
      description: 'Connect using WalletConnect'
    },
    {
      name: 'Coinbase Wallet',
      icon: '/assets/icons/coinbase.svg',
      description: 'Connect to your Coinbase wallet'
    }
  ]

  return (
    <div className="fccc gap-2">
      <div className="text-8 font-medium">Connect Your Wallet</div>
      <div className="text-4 text-[#898989]">Choose your preferred wallet to continue</div>

      <div className="mt-10 max-w-xl w-full space-y-6">
        {
          wallets.map((wallet, i) => (
            <WalletCard key={i} {...wallet} />
          ))
        }
      </div>
    </div>
  )
}

function WalletCard({ name, icon, description }: Wallet) {
  return (
    <div className="fbc select-none gap-4 b b-border rounded-xl px-6 py-3 clickable-99">
      <div className="size-13.5 fcc rounded-xl bg-[#242933]">
        <img src={icon} alt="icon" />
      </div>

      <div className="flex-1">
        <div className="text-4">{name}</div>
        <div className="text-3.5 text-[#898989]">{description}</div>
      </div>

      <div>
        <div className="i-material-symbols-arrow-forward-ios-rounded size-5"></div>
      </div>
    </div>
  )
}
