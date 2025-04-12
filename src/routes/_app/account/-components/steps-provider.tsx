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
  LoginPrivy,
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
  const stepValues = Object.values(CreateAccountStep).filter(value => typeof value === 'number') as number[]

  const [currentStep, setCurrentStep] = useState(stepValues[0])
  const [handler, setHandler] = useState<{ onReturn?: () => void }>({})

  const next = () => {
    if (currentStep === stepValues[stepValues.length - 1]) {
      return
    }

    setCurrentStep(prev => prev + 1)
  }

  const prev = () => {
    if (currentStep === stepValues[0]) {
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
