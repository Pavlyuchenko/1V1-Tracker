'use client'

import Link from 'next/link'
import { useState } from 'react'

type NavLink = {
  href: string
  label: string
  isButton?: boolean
}

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const defaultLinks: NavLink[] = [
    { href: '/rules', label: 'Pravidla' },
    { href: '/settings', label: 'Nastavení' },
    { href: '/edit-game', label: 'Upravit zápasy' },
    { href: '/new-game', label: 'Nová hra', isButton: true },
  ]

  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          <Link href="/" className="text-black hover:text-blue-600 font-bold text-base sm:text-lg flex-shrink-0 whitespace-nowrap">
            ⚽ Překopávaná
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden sm:flex gap-4 items-center flex-shrink-0">
            {defaultLinks.map((link) =>
              link.isButton ? (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold text-base transition shadow-lg flex-shrink-0"
                >
                  {link.label}
                </Link>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-gray-700 hover:text-blue-600 font-medium transition whitespace-nowrap"
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden flex flex-col gap-1.5 p-2"
          >
            <div className="w-6 h-0.5 bg-black"></div>
            <div className="w-6 h-0.5 bg-black"></div>
            <div className="w-6 h-0.5 bg-black"></div>
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <nav className="sm:hidden mt-4 pt-4 border-t border-gray-200 space-y-2">
            {defaultLinks.map((link) =>
              link.isButton ? (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold text-center transition"
                >
                  {link.label}
                </Link>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 font-medium transition"
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>
        )}
      </div>
    </div>
  )
}
