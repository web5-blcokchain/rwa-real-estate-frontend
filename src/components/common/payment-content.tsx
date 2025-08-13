import type { ConnectedWallet } from '@privy-io/react-auth'
import type { Dispatch, SetStateAction } from 'react'
import { PaymentWallet } from './payment-wallect'

export const PaymentContent: FC<{
  walletState: [ConnectedWallet | null, Dispatch<SetStateAction<ConnectedWallet | null>>]
} & React.HTMLAttributes<HTMLDivElement>> = ({
  walletState,
  className
}) => {
  const { t } = useTranslation()
  const [wallet, setWallet] = walletState
  return (
    <div className={cn('rounded-xl bg-[#202329] p-6 space-y-4', className)}>
      <div className="text-4.5">{t('properties.payment.bind_wallet')}</div>
      <PaymentWallet walletState={[wallet, setWallet]} />
      <div className="text-3.5 text-[#898989]">
        <div>{t('properties.payment.dear_user')}</div>
        <div>{t('properties.payment.bind_wallet_content_1')}</div>
        <div>{t('properties.payment.bind_wallet_content_2')}</div>
        <div>{t('properties.payment.bind_wallet_content_3')}</div>
        <div>{t('properties.payment.bind_wallet_content_4')}</div>
      </div>

    </div>
  )
}
