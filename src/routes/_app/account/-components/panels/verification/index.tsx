import INotice from '@/components/common/i-notice'
import { useState } from 'react'

import { useSteps } from '../../steps-provider'
import IndividualVerification from './individual'
import InstitutionalVerification from './institutional'

interface Verification {
  name: string
  icon: string
  description: string
  onClick: () => void
}

enum VisibleType {
  Select,
  Individual,
  Institutional
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
      return <IndividualVerification />
    case VisibleType.Institutional:
      return <InstitutionalVerification />
  }
}

function SelectVerification({ setCurrentVisible }: VerificationPanelProps) {
  const { setHandler } = useSteps()
  const { t } = useTranslation()

  const list: Verification[] = [
    {
      name: `${t('create.verification.individual')}`,
      icon: 'user',
      description: `${t('create.verification.individual_account')}`,
      onClick() {
        setCurrentVisible(VisibleType.Individual)

        setHandler({
          onReturn() {
            setCurrentVisible(VisibleType.Select)
          }
        })
      }
    },
    {
      name: `${t('create.verification.institutional')}`,
      icon: 'institutional',
      description: `${t('create.verification.organizations')}`,
      onClick() {
        setCurrentVisible(VisibleType.Institutional)

        setHandler({
          onReturn() {
            setCurrentVisible(VisibleType.Select)
          }
        })
      }
    }
  ]

  return (
    <div className="fccc gap-2">
      <div className="text-8 font-medium">{t('create.verification.title')}</div>
      <div className="text-4 text-[#898989]">{t('create.verification.subTitle')}</div>

      <div className="mt-10 max-w-xl w-full space-y-6">
        {
          list.map((item, i) => (
            <VerificationCard key={i} {...item} />
          ))
        }

        <INotice>
          {t('create.verification.notice')}
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
