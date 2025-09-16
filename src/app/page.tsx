'use client'

import { useState } from 'react'
import MetricsForm from '@/components/MetricsForm'
import ResultCard from '@/components/ResultCard'
import { diagnose, DiagnosisResult } from '@/lib/diagnosis'
import { track } from '@/lib/analytics'

export default function Home() {
  const [result, setResult] = useState<DiagnosisResult | null>(null)

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
    <main className="container-mobile py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Diagnóstico E-commerce
        </h1>
        <p className="text-lg text-gray-600 mb-2">
          Descubre dónde se pierde tu venta en 2 minutos
        </p>
        <p className="text-sm text-gray-500">
          Ingresa tus métricas del mes actual y obtén un diagnóstico personalizado
        </p>
      </div>

      {!result ? (
        <MetricsForm onDiagnosis={handleDiagnosis} />
      ) : (
        <ResultCard 
          result={result} 
          onNewDiagnosis={() => setResult(null)}
        />
      )}
    </main>
  )
}
