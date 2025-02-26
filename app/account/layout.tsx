'use client'

import { useRouter } from 'next/navigation'

export default function AccountLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const router = useRouter()

  return (
    <div className="size-full px-8">
      <div className="h-18 fbc">
        <button className="fyc select-none gap-1 text-[#898989] clickable" onClick={() => router.back()}>
          <span className="i-material-symbols-light-arrow-back-rounded size-6"></span>
          <span className="text-4">
            Return
          </span>
        </button>

        <div className="fyc gap-1">
          <div className="i-majesticons-globe-line size-5 bg-white"></div>
          <div className="text-4">English</div>
          <div className="i-ic-round-keyboard-arrow-down size-5 bg-white"></div>
        </div>
      </div>
      <div>
        {children}
      </div>
    </div>
  )
}
