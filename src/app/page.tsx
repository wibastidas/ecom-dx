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
    <main className="min-h-screen">
      <Header />
      <div className="container-responsive py-8">
        {/* Content */}
        {!result ? (
          <>
            {/* Hero */}
            <section className="text-center mb-10 md:mb-12">
              {/* Badge de credibilidad */}
              <div className="inline-flex items-center gap-2 border border-amber-200/60 text-amber-800 text-sm font-medium px-4 py-1.5 rounded-full mb-5" style={{background:'rgba(255,255,255,0.80)', backdropFilter:'blur(12px)', WebkitBackdropFilter:'blur(12px)', boxShadow:'0 2px 12px rgba(202,138,4,0.12)'}}>
                <span className="relative flex-shrink-0 w-4 h-4">
                  <span className="absolute inset-0 rounded-full bg-green-400" style={{ animation: 'pulse-ring 2s ease-out infinite' }} />
                  <svg className="w-4 h-4 text-green-500 relative" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </span>
                Gratis · Sin registro · Resultados en 30 segundos
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 leading-tight max-w-3xl mx-auto">
                {t('app.heroH1')}
              </h1>
              <p className="text-lg sm:text-xl text-slate-600 mb-2 max-w-2xl mx-auto">
                {t('app.heroSub')}
              </p>
            </section>

            {/* Video Vimeo — ID 1167485245 (vsl3, con subtítulos) */}
            <section className="mb-10 md:mb-12 max-w-3xl mx-auto">
              <div className="relative rounded-2xl overflow-hidden shadow-xl shadow-amber-100/60" style={{ paddingBottom: '75%', background: 'rgba(241,245,249,0.8)' }}>
                <iframe
                  src="https://player.vimeo.com/video/1167485245?badge=0&autopause=0&player_id=0&app_id=58479&byline=0&title=0&portrait=0"
                  className="absolute top-0 left-0 w-full h-full"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  title="vsl3"
                />
              </div>
              <p className="text-center text-gray-600 text-sm mt-4">
                {t('app.videoPie')}
              </p>
              <div className="text-center mt-6">
                <a
                  href="#diagnostico-form"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold bg-amber-600 text-white hover:bg-amber-700 transition-colors shadow-md hover:shadow-lg cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault()
                    document.getElementById('diagnostico-form')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
                  </svg>
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
