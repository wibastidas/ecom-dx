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

  const handleDiagnosis = (visits: number, carts: number, purchases: number, sales?: number, adspend?: number, ordersCount?: number, storeUrl?: string, platform?: string, checkouts?: number) => {
    try {
      const diagnosis = diagnose(visits, carts, purchases, sales, adspend, ordersCount, checkouts)
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

      // Log de uso en leads_analizados (sin login, fire-and-forget).
      // URL y plataforma son opcionales; se envían solo si el usuario los completó.
      logLeadAnalizado({
        ...(storeUrl?.trim() && { storeUrl: storeUrl.trim() }),
        ...(platform && { platform }),
        visits,
        carts,
        checkouts: checkouts ?? null,
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
        cac: diagnosis.cac ?? null,
        cartToCheckout: diagnosis.cartToCheckout ?? null,
        checkoutToBuy: diagnosis.checkoutToBuy ?? null,
        checkoutInsight: diagnosis.checkoutInsight ?? null,
        quickBuyMode: diagnosis.quickBuyMode ?? false
      }).catch(() => {}) // fire-and-forget, no bloquear UI
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
            {/* Hero — logo comentado para reducir scroll */}
            <section className="text-center mb-10 md:mb-12">
              {/* <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 mb-6">
                <img src="/logo.svg" alt="Radar E-commerce" className="w-16 h-16 sm:w-20 sm:h-20" />
              </div> */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight max-w-3xl mx-auto">
                {t('app.heroH1')}
              </h1>
              <p className="text-lg sm:text-xl text-gray-700 mb-2 max-w-2xl mx-auto">
                {t('app.heroSub')}
              </p>
            </section>

            {/* Video embed (2 min) — definí NEXT_PUBLIC_VIDEO_EMBED_URL en .env para mostrar tu video (ej. https://www.youtube.com/embed/VIDEO_ID) */}
            <section className="mb-10 md:mb-12 max-w-3xl mx-auto">
              <div className="aspect-video rounded-2xl overflow-hidden bg-gray-100 shadow-lg flex items-center justify-center">
                {process.env.NEXT_PUBLIC_VIDEO_EMBED_URL ? (
                  <iframe
                    title="Radar - Cómo detectar tu cuello de botella"
                    className="w-full h-full"
                    src={process.env.NEXT_PUBLIC_VIDEO_EMBED_URL}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <p className="text-gray-400 text-sm p-4 text-center">Agrega <code className="bg-gray-200 px-1 rounded">NEXT_PUBLIC_VIDEO_EMBED_URL</code> en .env para mostrar el video</p>
                )}
              </div>
              <p className="text-center text-gray-600 text-sm mt-4">
                {t('app.videoPie')}
              </p>
              <div className="text-center mt-6">
                <a
                  href="#diagnostico-form"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
                  onClick={(e) => {
                    e.preventDefault()
                    document.getElementById('diagnostico-form')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                >
                  {t('app.heroCta')}
                </a>
              </div>
            </section>

            {/* Formulario tipo panel */}
            <section id="diagnostico-form" className="scroll-mt-8">
              <MetricsForm onDiagnosis={handleDiagnosis} openAccordion={openAccordion} />
            </section>
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
