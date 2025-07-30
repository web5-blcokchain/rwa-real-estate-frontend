import type { ConnectedWallet } from '@privy-io/react-auth'
import { WalletSelector } from '@/components/common/wallet-selector'
import { useUserStore } from '@/stores/user'
import { ensurePrivyNetwork } from '@/utils/privy'
import { usePrivy } from '@privy-io/react-auth'
import { Button } from 'antd'
import { useSteps } from '../steps-provider'

export default function BindWalletPanel() {
  const [wallet, setWallet] = useState<ConnectedWallet | null>(null)

  const { t } = useTranslation()
  const { next } = useSteps()
  const { setRegisterData } = useUserStore()
  const { linkWallet } = usePrivy()

  const [walletList, setWalletList] = useState<ConnectedWallet[]>([])

  useEffect(() => {
    if (!wallet) {
      return
    }

    ensurePrivyNetwork(wallet)

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
      {
        walletList.length === 0 && (
          <div className="text-center text-gray">{t('create.bind-wallet.empty')}</div>
        )
      }

      <div>
        <WalletSelector
          walletState={[wallet, setWallet]}
          walletListState={[walletList, setWalletList]}
        />
      </div>

      <div className="mt-8 fcc">
        {
          walletList.length === 0
            ? (
                <Button
                  type="primary"
                  size="large"
                  className="text-black!"
                  onClick={linkWallet}
                >
                  {t('create.bind-wallet.connect')}
                  1
                </Button>
              )
            : (
                <Button
                  type="primary"
                  size="large"
                  className="text-black!"
                  onClick={nextStep}
                >
                  {t('create.button.next')}
                </Button>
              )
        }

      </div>
    </div>
  )
}
