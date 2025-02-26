'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    setTimeout(() => {
      router.push('/home')
    }, 1500)
  }, [])

  return (
    <div className="h-128 fcc">
      <div className="i-eos-icons-loading size-10"></div>
    </div>
  )
}
