import { createContext, useContext, useState } from 'react'

interface StepsContextType {
  currentStep: number
  setCurrentStep: (step: number) => void
  next: () => void
  prev: () => void
  handler: {
    onReturn?: () => void
  }
  setHandler: (handler: { onReturn?: () => void }) => void
}

const StepsContext = createContext<StepsContextType | undefined>(undefined)

export enum CreateAccountStep {
  BaseInfo,
  Wallet,
  Verification
}

export function useSteps() {
  const context = useContext(StepsContext)

  if (!context) {
    throw new Error('useSteps must be used within a StepsProvider')
  }

  return context
}

export const StepsProvider: FC = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(CreateAccountStep.BaseInfo)
  const [handler, setHandler] = useState<{ onReturn?: () => void }>({})

  const next = () => {
    if (currentStep === CreateAccountStep.Verification) {
      return
    }

    setCurrentStep(prev => prev + 1)
  }

  const prev = () => {
    if (currentStep === CreateAccountStep.BaseInfo) {
      return
    }

    if (handler.onReturn) {
      handler.onReturn()
      handler.onReturn = undefined
      return
    }

    setCurrentStep(prev => prev - 1)
  }

  return (
    <StepsContext value={{
      currentStep,
      setCurrentStep,
      next,
      prev,
      handler,
      setHandler
    }}
    >
      {children}
    </StepsContext>
  )
}
