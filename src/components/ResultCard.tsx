'use client'

import { useState } from 'react'
import { DiagnosisResult } from '@/lib/diagnosis'
import { getATCComparison, getCBComparison, getCRComparison } from '@/lib/metricsHelpers'
import useTranslations from '@/hooks/useTranslations'
import { CTA_WHATSAPP_URL } from '@/lib/constants'
import Tooltip from './Tooltip'
// MVP: Guardado e historial comentados. Más adelante remover comentarios para restaurar.
// import SaveModal from './SaveModal'
// import HistoryModal from './HistoryModal'
import ShareModal from './ShareModal'
// import { useAuth } from '@/lib/auth'

interface ResultCardProps {
  result: DiagnosisResult
  onNewDiagnosis: () => void
  onEditData: () => void
  diagnosisData: {
    visits: number
    carts: number
    orders: number
    sales?: number | null
    adspend?: number | null
    ordersCount?: number | null
  }
  onResultChange?: (result: DiagnosisResult) => void
  onDiagnosisDataChange?: (data: any) => void
}

export default function ResultCard({ result, onNewDiagnosis, onEditData, diagnosisData, onResultChange, onDiagnosisDataChange }: ResultCardProps) {
  const { t } = useTranslations()
  // const { user, signIn } = useAuth()
  // const [showSaveDialog, setShowSaveDialog] = useState(false)
  // const [showSaveModal, setShowSaveModal] = useState(false)
  // const [showHistoryModal, setShowHistoryModal] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  // const [previousUser, setPreviousUser] = useState(user)

  // MVP: Redirigir al Home si el usuario cierra sesión – comentado.
  // useEffect(() => {
  //   if (previousUser && !user) {
  //     onNewDiagnosis()
  //   }
  //   setPreviousUser(user)
  // }, [user, previousUser])

  // MVP: Iniciar sesión y guardar – comentado.
  // const handleSaveClick = async () => {
  //   if (!user) {
  //     try {
  //       await signIn()
  //       setShowSaveModal(true)
  //     } catch (error) {
  //       console.error('Error al iniciar sesión:', error)
  //     }
  //   } else {
  //     setShowSaveModal(true)
  //   }
  // }

  // MVP: Guardado desde modal – comentado.
  // const handleSave = async (saveData: { yyyymm: string, monthLabel: string, note: string }) => {
  //   try {
  //     setShowSaveModal(false)
  //   } catch (error) {
  //     console.error('Error al guardar:', error)
  //   }
  // }


  // Próximos pasos desde i18n (result.actionsByDiagnosis.{dx}, una acción por línea)
  const getBasicActions = (dx: string): string[] => {
    const raw = t(`result.actionsByDiagnosis.${dx}`)
    if (typeof raw === 'string' && raw && !raw.startsWith('result.actionsByDiagnosis.')) {
      return raw.split('\n').filter(Boolean)
    }
    return ['Revisa tu embudo de ventas.', 'Optimiza página y checkout.', 'Mide y repite lo que funciona.']
  }

  const getStatusLabel = (status: 'above' | 'equal' | 'below') => {
    if (status === 'above') return t('result.statusAlto')
    if (status === 'equal') return t('result.statusEnRango')
    return t('result.statusBajo')
  }

  const hasCheckoutInsight = result.checkoutInsight && (result.checkoutInsight === 'logistica' || result.checkoutInsight === 'pago' || result.checkoutInsight === 'ambos')

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Above the fold: título + sub + CTA WhatsApp */}
      <div className="card-elevated text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
          {t('result.heroTitle', { dx: t(`bottlenecks.${result.dx}`) })}
        </h1>
        <p className="text-gray-600 mb-4">
          {t('result.heroSub')}
        </p>
        {result.quickBuyMode && (
          <p className="text-sm text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200 inline-block mb-4">
            ⚡ {t('result.quickBuyHint')}
          </p>
        )}
        <a
          href={CTA_WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold text-lg px-8 py-4 rounded-xl shadow-lg transition-all hover:shadow-xl"
        >
          <svg className="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          {t('result.ctaWhatsApp')}
        </a>
        <p className="text-sm text-gray-500 mt-3">
          {t('result.ctaMicrocopy')}
        </p>
      </div>

      {/* Tus tasas clave: 3 cards, valor + estado corto, rango solo en tooltip */}
      <div className="card-elevated">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('result.tasasKey')}</h2>
        <div className="grid grid-cols-3 gap-4">
          {(() => {
            const atcComparison = getATCComparison(result.atc * 100)
            return (
              <div className={`text-center p-4 ${atcComparison.bgColorClass} rounded-xl min-w-0`}>
                <Tooltip content={`${t('tooltips.ATC')} ${t('metrics.atcNormal')}`}>
                  <div className="text-sm text-gray-600 cursor-help mb-1">{t('metrics.atcTitle')} ⓘ</div>
                </Tooltip>
                <div className={`text-xl font-bold ${atcComparison.colorClass}`}>
                  {(result.atc * 100).toFixed(1)}%
                </div>
                <div className={`text-sm font-semibold ${atcComparison.colorClass} mt-1`}>
                  {getStatusLabel(atcComparison.status)}
                </div>
              </div>
            )
          })()}
          {(() => {
            const cbComparison = getCBComparison(result.cb * 100)
            return (
              <div className={`text-center p-4 ${cbComparison.bgColorClass} rounded-xl min-w-0`}>
                <Tooltip content={`${t('tooltips.CB')} ${t('metrics.cbNormal')}`}>
                  <div className="text-sm text-gray-600 cursor-help mb-1">{t('metrics.cbTitle')} ⓘ</div>
                </Tooltip>
                <div className={`text-xl font-bold ${cbComparison.colorClass}`}>
                  {(result.cb * 100).toFixed(1)}%
                </div>
                <div className={`text-sm font-semibold ${cbComparison.colorClass} mt-1`}>
                  {getStatusLabel(cbComparison.status)}
                </div>
              </div>
            )
          })()}
          {(() => {
            const crComparison = getCRComparison(result.cr * 100)
            return (
              <div className={`text-center p-4 ${crComparison.bgColorClass} rounded-xl min-w-0`}>
                <Tooltip content={`${t('tooltips.CR')} ${t('metrics.crNormal')}`}>
                  <div className="text-sm text-gray-600 cursor-help mb-1">{t('metrics.crTitle')} ⓘ</div>
                </Tooltip>
                <div className={`text-xl font-bold ${crComparison.colorClass}`}>
                  {(result.cr * 100).toFixed(1)}%
                </div>
                <div className={`text-sm font-semibold ${crComparison.colorClass} mt-1`}>
                  {getStatusLabel(crComparison.status)}
                </div>
              </div>
            )
          })()}
        </div>
      </div>

      {/* Tus 3 próximos pasos */}
      <div className="card-elevated">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('result.proximosPasos')}</h2>
        <ul className="space-y-2 list-none">
          {getBasicActions(result.dx).map((action, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm font-semibold">
                {index + 1}
              </span>
              <span className="text-gray-700">{action}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Señal extra: solo si hay datos de checkouts */}
      {hasCheckoutInsight && (
        <div className="card-elevated bg-amber-50 border border-amber-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">{t('result.senalExtra')}</h3>
          <div className="text-sm text-gray-700 space-y-1">
            {(result.checkoutInsight === 'logistica' || result.checkoutInsight === 'ambos') && (
              <p><strong>{t('result.fugaEnvio')}</strong> {t('result.fugaEnvioRec')}</p>
            )}
            {(result.checkoutInsight === 'pago' || result.checkoutInsight === 'ambos') && (
              <p><strong>{t('result.fugaPago')}</strong> {t('result.fugaPagoRec')}</p>
            )}
          </div>
        </div>
      )}

      {/* CTA WhatsApp repetido + links secundarios */}
      <div className="card-elevated text-center">
        <p className="text-gray-700 mb-2">{t('result.ctaFinalLine1')}</p>
        <p className="text-gray-600 text-sm mb-6">{t('result.ctaFinalLine2')}</p>
        <a
          href={CTA_WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold text-lg px-8 py-4 rounded-xl shadow-lg transition-all hover:shadow-xl"
        >
          <svg className="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          {t('result.ctaWhatsApp')}
        </a>
        <div className="flex flex-wrap justify-center gap-4 mt-6 pt-4 border-t border-gray-100">
          <button type="button" onClick={onNewDiagnosis} className="text-sm text-gray-500 hover:text-gray-700 underline">
            {t('result.newDiagLink')}
          </button>
          <button type="button" onClick={() => setShowShareModal(true)} className="text-sm text-gray-500 hover:text-gray-700 underline">
            {t('result.shareLink')}
          </button>
        </div>
      </div>

      {/* MVP: Modal de guardar (mes y nota) – comentado */}
      {/* <SaveModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onSave={handleSave}
        diagnosisData={{
          dx: result.dx,
          visits: diagnosisData.visits,
          carts: diagnosisData.carts,
          orders: diagnosisData.orders,
          atc: result.atc,
          cb: result.cb,
          cr: result.cr,
          sales: diagnosisData.sales || null,
          adspend: diagnosisData.adspend || null,
          ordersCount: diagnosisData.ordersCount || null,
          aov: result.aov || null,
          roas: result.roas || null,
          cac: result.cac || null
        }}
      /> */}

      {/* MVP: Modal de historial – comentado */}
      {/* <HistoryModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
      /> */}

      {/* Modal de compartir */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        diagnosisData={{
          dx: result.dx,
          visits: diagnosisData.visits,
          carts: diagnosisData.carts,
          orders: diagnosisData.orders,
          atc: result.atc,
          cb: result.cb,
          cr: result.cr
        }}
      />
    </div>
  )
}