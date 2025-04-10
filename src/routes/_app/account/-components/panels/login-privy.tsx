import { useUserStore } from '@/stores/user'
import { usePrivy } from '@privy-io/react-auth'
import { Button } from 'antd'
import { useSteps } from '../steps-provider'

export default function LoginPrivyPanel() {
  const { t } = useTranslation()
  const { login, linkEmail, user, ready, authenticated } = usePrivy()
  const { setRegisterData } = useUserStore()

  const { next } = useSteps()

  useEffect(() => {
    if (!ready || !authenticated || !user?.wallet) {
      return
    }

    setRegisterData({
      wallet_address: user.wallet.address
    })
  }, [user?.wallet?.address])

  if (!ready) {
    return (
      <Waiting
        className="fcc"
        iconClass="size-8"
      />
    )
  }

  if (!authenticated) {
    return (
      <div className="fccc gap-8">
        <div>
          <Button
            type="primary"
            size="large"
            className="h-12 px-8 text-background!"
            onClick={login}
          >
            <div className="fyc gap-2">
              <div className="i-mingcute-wallet-4-fill size-6"></div>
              <div>{t('create.step1')}</div>
            </div>
          </Button>
        </div>
      </div>
    )
  }

  if (!user?.email) {
    return (
      <div className="fccc gap-8">
        <div className="text-8">{t('create.message.link_email')}</div>
        <Button
          type="primary"
          size="large"
          className="h-12 px-8 text-background!"
          onClick={linkEmail}
        >
          <div className="fyc gap-2">
            <div className="i-material-symbols-mail-rounded size-6"></div>
            <div>{t('create.button.link_email')}</div>
          </div>
        </Button>
      </div>
    )
  }

  return (
    <div className="fccc gap-8">
      <div className="text-8">{t('create.logged_in_privy')}</div>
      <div className="fyc gap-2">
        <div className="i-material-symbols-check-circle-rounded bg-green"></div>
        <div>{user?.email?.address || ''}</div>
      </div>
      <div>
        <Button
          type="primary"
          size="large"
          className="text-black!"
          onClick={next}
        >
          {t('create.button.next')}
        </Button>
      </div>
    </div>
  )
}
