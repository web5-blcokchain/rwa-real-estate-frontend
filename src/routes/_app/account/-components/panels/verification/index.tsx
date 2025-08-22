import INotice from '@/components/common/i-notice'
import { AccountType } from '@/enums/create-account'
import { useUserStore } from '@/stores/user'
import { useState } from 'react'
import AssetTokenization from './assetTokenization'
import IndividualVerification from './individual'
import InstitutionalVerification from './institutional'

interface Verification {
  name: string
  icon: string
  description: string
  onClick: () => void
}

export enum VisibleType {
  Select,
  Individual,
  Institutional,
  AssetTokenization
}

interface VerificationPanelProps {
  setCurrentVisible: (visible: VisibleType) => void
}

export default function VerificationPanel() {
  const [currentVisible, setCurrentVisible] = useState<VisibleType>(VisibleType.Select)

  switch (currentVisible) {
    case VisibleType.Select:
      return <SelectVerification setCurrentVisible={setCurrentVisible} />
    case VisibleType.Individual:
      return <IndividualVerification setCurrentVisible={setCurrentVisible} />
    case VisibleType.Institutional:
      return <InstitutionalVerification setCurrentVisible={setCurrentVisible} />
    case VisibleType.AssetTokenization:
      return <AssetTokenization setCurrentVisible={setCurrentVisible} />
  }
}

function SelectVerification({ setCurrentVisible }: VerificationPanelProps) {
  // const { setHandler } = useSteps()
  const { t } = useTranslation()
  const { setRegisterData } = useUserStore()

  const list: Verification[] = [
    {
      name: `${t('create.verification.individual')}`,
      icon: 'user',
      description: `${t('create.verification.individual_account')}`,
      onClick() {
        setCurrentVisible(VisibleType.Individual)
        setRegisterData({
          type: AccountType.Individual
        })

        // setHandler({
        //   onReturn() {
        //     setCurrentVisible(VisibleType.Select)
        //   }
        // })
      }
    },
    {
      name: `${t('create.verification.institutional')}`,
      icon: 'institutional',
      description: `${t('create.verification.organizations')}`,
      onClick() {
        setCurrentVisible(VisibleType.Institutional)
        setRegisterData({
          type: AccountType.Institutional
        })

        // setHandler({
        //   onReturn() {
        //     setCurrentVisible(VisibleType.Select)
        //   }
        // })
      }
    },
    {
      name: `${t('create.verification.asset_tokenization')}`,
      icon: 'homeowner',
      description: `${t('create.verification.asset_tokenization_desc')}`,
      onClick() {
        setCurrentVisible(VisibleType.AssetTokenization)
        setRegisterData({
          type: AccountType.Individual
        })
      }
    }
  ]

  return (
    <div className="fccc gap-2">
      <div className="text-center text-8 font-medium max-md:text-2xl">{t('create.verification.title')}</div>
      <div className="text-center text-4 text-[#898989] max-md:text-sm">{t('create.verification.subTitle')}</div>

      <div className="mt-10 max-w-xl w-full space-y-6">
        {
          list.map((item, i) => (
            <VerificationCard key={i} {...item} />
          ))
        }

        <INotice>
          <div>
            <p>{t('create.verification.notice_desc')}</p>
            <p>
              {' '}
              {t('create.verification.notice')}
            </p>

          </div>
        </INotice>
      </div>
    </div>
  )
}

function VerificationCard({ name, icon, description, onClick }: Verification) {
  return (
    <div className="fbc select-none gap-4 b b-border rounded-xl px-6 py-8 clickable-99" onClick={onClick}>
      <div className="size-13.5 fcc rounded-full bg-[#242933]">
        <SvgIcon name={icon} />
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
