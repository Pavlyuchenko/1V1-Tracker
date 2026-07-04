'use client'

import Link from 'next/link'
import Navigation from '@/app/components/Navigation'

export default function Pravidla() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-black mb-8">Pravidla</h1>

        <div className="bg-gray-50 border border-gray-200 p-8 space-y-6">
          <p className="text-gray-600 italic">Pravidla budou přidána...</p>
        </div>

        <Link href="/" className="inline-block mt-8 text-blue-600 hover:text-blue-700 font-semibold">
          ← Zpět na domovskou stránku
        </Link>
      </div>
    </div>
  )
}
