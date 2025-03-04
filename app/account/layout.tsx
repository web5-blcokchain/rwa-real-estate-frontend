'use client'

import { StepsProvider, useSteps } from './-components/steps-provider'

export default function AccountLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <StepsProvider>
      <div className="size-full fccc px-8">
        <div className="h-18 w-full fbc">
          <ReturnButton />

          <div className="fyc gap-1">
            <div className="i-majesticons-globe-line size-5 bg-white"></div>
            <div className="text-4">English</div>
            <div className="i-ic-round-keyboard-arrow-down size-5 bg-white"></div>
          </div>
        </div>
        <div className="w-full flex-1 of-y-auto">
          {children}
        </div>
      </div>
    </StepsProvider>
  )
}

function ReturnButton() {
  const { prev, handler, setHandler } = useSteps()

  function onReturnClick() {
    if (handler.onReturn) {
      handler.onReturn()
      setHandler({})
      return
    }

    prev()
  }

  return (
    <button className="fyc select-none gap-1 text-[#898989] clickable" onClick={onReturnClick}>
      <span className="i-material-symbols-light-arrow-back-rounded size-6"></span>
      <span className="text-4">
        Return
      </span>
    </button>
  )
}
