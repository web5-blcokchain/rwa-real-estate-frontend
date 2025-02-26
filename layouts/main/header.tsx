'use client'

import { cn } from '@/utils/style'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function MainHeader() {
  const pathname = usePathname()

  const links = [
    { title: 'Home', href: '/home' },
    { title: 'Properties', href: '/properties' },
    { title: 'Investment', href: '/investment' },
    { title: 'About', href: '/about' }
  ]

  return (
    <header className="sticky left-0 top-0 h-32 fbc bg-background px-8 text-text">
      <div className="fyc gap-8">
        <div className="text-5 text-primary">Real Estate RWA</div>

        <nav className="fyc gap-8 text-4 text-[#8d909a]">
          {
            links.map((link, i) => (
              <Link
                key={i}
                href={link.href}
                className={
                  cn(
                    'cursor-pointer',
                    pathname === link.href ? 'text-text' : ''
                  )
                }
              >
                {link.title}
              </Link>
            ))
          }
        </nav>
      </div>

      <div className="fyc gap-4">
        <div className="fyc gap-1">
          <div className="i-majesticons-globe-line size-5 bg-white"></div>
          <div className="text-4">English</div>
          <div className="i-ic-round-keyboard-arrow-down size-5 bg-white"></div>
        </div>

        <div className="i-material-symbols-help-outline size-5 bg-white"></div>
        <div className="i-material-symbols-notifications-outline size-5 bg-white"></div>
        <div className="i-material-symbols-favorite-outline-rounded size-5 bg-white"></div>

        <div className="fyc gap-1">
          <div className="i-material-symbols-account-circle-outline size-5 bg-white"></div>
          <div className="text-4">chloe</div>
          <div className="i-ic-round-keyboard-arrow-down size-5 bg-white"></div>
        </div>
      </div>
    </header>
  )
}
