import type { ConnectedWallet } from '@privy-io/react-auth'
import { WalletSelector } from '@/components/common/wallet-selector'
import { useUserStore } from '@/stores/user'
import { Button } from 'antd'
import { useSteps } from '../steps-provider'

export default function BindWalletPanel() {
  const [wallet, setWallet] = useState<ConnectedWallet | null>(null)

  const { t } = useTranslation()
  const { next } = useSteps()
  const { setRegisterData } = useUserStore()

  useEffect(() => {
    if (!wallet) {
      return
    }

    setRegisterData({
      wallet_address: wallet.address
    })
  }, [wallet])

  function nextStep() {
    if (!wallet) {
      toast.error(t('create.bind-wallet.error'))
      return
    }

    next()
  }

  return (
    <div>
      <div>
        <WalletSelector
          walletState={[wallet, setWallet]}
        />
      </div>

      <div className="mt-8 fcc">
        <Button
          type="primary"
          size="large"
          className="text-black!"
          onClick={nextStep}
        >
          {t('create.button.next')}
        </Button>
      </div>
    </div>
  )
}
