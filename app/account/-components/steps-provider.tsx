'use client'

import { createContext, useContext, useState } from 'react'

interface StepsContextType {
  currentStep: number
  setCurrentStep: (step: number) => void
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

  return (
    <StepsContext value={{ currentStep, setCurrentStep }}>
      {children}
    </StepsContext>
  )
}
