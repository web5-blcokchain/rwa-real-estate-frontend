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

  const list: Verification[] = [
    {
      name: 'Individual Investor',
      icon: '/assets/icons/user.svg',
      description: 'For personal investment accounts',
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
      name: 'Institutional Investor',
      icon: '/assets/icons/institutional.svg',
      description: 'For companies and organizations',
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
      <div className="text-8 font-medium">Choose Your Identity Type</div>
      <div className="text-4 text-[#898989]">Select whether you are an individual or institutional investor</div>

      <div className="mt-10 max-w-xl w-full space-y-6">
        {
          list.map((item, i) => (
            <VerificationCard key={i} {...item} />
          ))
        }
        <div className="flex gap-4 b b-border rounded-xl px-6 py-8">
          <div className="pr top-1 size-4 fcc shrink-0 rounded-full bg-primary-1"></div>

          <div className="text-[#d2d2d2]">
            Different verification requirements apply to individual and institutional investors.
            Please select the appropriate type to proceed with the verification process.
          </div>
        </div>
      </div>
    </div>
  )
}

function VerificationCard({ name, icon, description, onClick }: Verification) {
  return (
    <div className="fbc select-none gap-4 b b-border rounded-xl px-6 py-8 clickable-99" onClick={onClick}>
      <div className="size-13.5 fcc rounded-full bg-[#242933]">
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
