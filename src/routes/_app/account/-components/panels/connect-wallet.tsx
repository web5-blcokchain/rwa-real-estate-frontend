import { useSteps } from '../steps-provider'

interface Wallet {
  name: string
  icon: string
  description: string
  onClick: () => void
}

export default function ConnectWalletPanel() {
  const { next } = useSteps()
  const { t } = useTranslation()

  const wallets: Wallet[] = [
    {
      name: `${t('create.wallet.metamask')}`,
      icon: new URL('@/assets/icons/meta-mask.svg', import.meta.url).href,
      description: `${t('create.wallet.metaContent')}`,
      onClick() {
        next()
      }
    },
    {
      name: `${t('create.wallet.walletConnect')}`,
      icon: new URL('@/assets/icons/wallet.svg', import.meta.url).href,
      description: `${t('create.wallet.walletContent')}`,
      onClick() {
        next()
      }
    },
    {
      name: `${t('create.wallet.coinbase')}`,
      icon: new URL('@/assets/icons/coinbase.svg', import.meta.url).href,
      description: `${t('create.wallet.coinbaseContent')}`,
      onClick() {
        next()
      }
    }
  ]

  return (
    <div className="fccc gap-2">
      <div className="text-8 font-medium">{t('create.wallet.title')}</div>
      <div className="text-4 text-[#898989]">{t('create.wallet.subTitle')}</div>

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

function WalletCard({ name, icon, description, onClick }: Wallet) {
  return (
    <div className="fbc select-none gap-4 b b-border rounded-xl px-6 py-3 clickable-99" onClick={onClick}>
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
