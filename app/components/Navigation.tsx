'use client'

import Link from 'next/link'

type NavLink = {
  href: string
  label: string
  isButton?: boolean
}

export default function Navigation() {
  const defaultLinks: NavLink[] = [
    { href: '/rules', label: 'Pravidla' },
    { href: '/settings', label: 'Nastavení' },
    { href: '/new-game', label: 'Nová hra', isButton: true },
  ]

  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="text-black hover:text-blue-600 font-bold text-lg flex-shrink-0">
            ⚽ Překopávaná
          </Link>
          <nav className="flex gap-4 sm:gap-8 items-center flex-shrink-0">
            {defaultLinks.map((link) =>
              link.isButton ? (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold text-sm sm:text-base transition shadow-lg flex-shrink-0"
                >
                  {link.label}
                </Link>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs sm:text-sm text-gray-700 hover:text-blue-600 font-medium transition whitespace-nowrap"
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>
        </div>
      </div>
    </div>
  )
}
