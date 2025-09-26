'use client'

import { useState } from 'react'
import MetricsForm from '@/components/MetricsForm'
import ResultCard from '@/components/ResultCard'
import { diagnose, DiagnosisResult } from '@/lib/diagnosis'
import { track } from '@/lib/analytics'
import useTranslations from '@/hooks/useTranslations'

export default function Home() {
  const [result, setResult] = useState<DiagnosisResult | null>(null)
  const { t } = useTranslations()

  const handleDiagnosis = (visits: number, carts: number, purchases: number) => {
    console.log('🔍 Diagnóstico iniciado:', { visits, carts, purchases })
    const diagnosis = diagnose(visits, carts, purchases)
    console.log('📊 Resultado del diagnóstico:', diagnosis)
    setResult(diagnosis)
    
    // Track the diagnosis result view
    track('diag_result_view', { 
      diagnosis: diagnosis.dx,
      cv: diagnosis.cv,
      cc: diagnosis.cc,
      tc: diagnosis.tc
    })
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container-responsive py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-2 leading-tight">
                  {t('app.title')}
                </h1>
                <p className="hero-subtitle mb-4" dangerouslySetInnerHTML={{ __html: t('app.subtitle') }}>
                </p>
                <p className="hero-description">
                  {t('app.help')}
                </p>
          </div>
        </div>

        {/* Content */}
        {!result ? (
          <MetricsForm onDiagnosis={handleDiagnosis} />
        ) : (
          <ResultCard 
            result={result} 
            onNewDiagnosis={() => setResult(null)}
          />
        )}
      </div>
    </main>
  )
}
