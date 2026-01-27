'use client'

// 🚀 Deploy automático - Mejoras implementadas
import { useState, useEffect } from 'react'
import MetricsForm from '@/components/MetricsForm'
import ResultCard from '@/components/ResultCard'
import Header from '@/components/Header'
import { diagnose, DiagnosisResult } from '@/lib/diagnosis'
import { track } from '@/lib/analytics'
import { logLeadAnalizado } from '@/lib/leadLog'
import useTranslations from '@/hooks/useTranslations'

export default function Home() {
  const [result, setResult] = useState<DiagnosisResult | null>(null)
  const [diagnosisData, setDiagnosisData] = useState<{
    visits: number
    carts: number
    orders: number
    sales?: number | null
    adspend?: number | null
    ordersCount?: number | null
  } | null>(null)
  const [openAccordion, setOpenAccordion] = useState(false)
  const { t } = useTranslations()

  // Scroll automático al inicio cuando se muestre el resultado
  useEffect(() => {
    if (result) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [result])

  const handleDiagnosis = (visits: number, carts: number, purchases: number, sales?: number, adspend?: number, ordersCount?: number, storeUrl?: string, platform?: string) => {
    try {
      const diagnosis = diagnose(visits, carts, purchases, sales, adspend, ordersCount)
      setResult(diagnosis)

      // Guardar datos de diagnóstico para el modal de guardar
      setDiagnosisData({
        visits,
        carts,
        orders: purchases,
        sales: sales || null,
        adspend: adspend || null,
        ordersCount: ordersCount || null
      })

      // Track the diagnosis result view
      track('diag_result_view', {
        diagnosis: diagnosis.dx,
        atc: diagnosis.atc,
        cb: diagnosis.cb,
        cr: diagnosis.cr
      })

      // Log de uso en leads_analizados (sin login, fire-and-forget)
      if (storeUrl != null && platform != null) {
        logLeadAnalizado({
          storeUrl,
          platform,
          visits,
          carts,
          orders: purchases,
          sales: sales ?? null,
          adspend: adspend ?? null,
          ordersCount: ordersCount ?? null,
          dx: diagnosis.dx,
          atc: diagnosis.atc,
          cb: diagnosis.cb,
          cr: diagnosis.cr,
          aov: diagnosis.aov ?? null,
          roas: diagnosis.roas ?? null,
          cac: diagnosis.cac ?? null
        }).catch(() => {}) // fire-and-forget, no bloquear UI
      }
    } catch (error) {
      console.error('❌ Error en handleDiagnosis:', error)
    }
  }

  const handleEditData = () => {
    setResult(null)
    setDiagnosisData(null)
    setOpenAccordion(true) // Abrir acordeón cuando se edite desde "Recalcular"
    // Scroll automático al inicio cuando se regrese al formulario
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleNewDiagnosis = () => {
    setResult(null)
    setDiagnosisData(null)
    setOpenAccordion(false) // Resetear acordeón para nuevo diagnóstico
    // Scroll automático al inicio cuando se regrese al formulario
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      <div className="container-responsive py-8">
        {/* Content */}
        {!result ? (
          <>
            {/* Hero Section - Solo en el formulario */}
            <div className="text-center mb-12">
              <div className="mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 mb-6">
                  <img 
                    src="/logo.svg" 
                    alt="Radar E-commerce" 
                    className="w-20 h-20"
                  />
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-2 leading-tight">
                  <span dangerouslySetInnerHTML={{ __html: t('app.title').replace('E-commerce', 'E<span style="white-space: nowrap;">-commerce</span>') }} />
                </h1>
                <p className="hero-subtitle mb-4" dangerouslySetInnerHTML={{ __html: t('app.subtitle') }}>
                </p>
                <p className="hero-description">
                  {t('app.help')}
                </p>
              </div>
            </div>
            <MetricsForm onDiagnosis={handleDiagnosis} openAccordion={openAccordion} />
          </>
        ) : (
          <ResultCard 
            result={result} 
            onNewDiagnosis={handleNewDiagnosis}
            onEditData={handleEditData}
            diagnosisData={diagnosisData!}
            onResultChange={setResult}
            onDiagnosisDataChange={setDiagnosisData}
          />
        )}
      </div>
    </main>
  )
}
// Deploy automático funcionando - Wed Oct  1 19:24:04 -03 2025
