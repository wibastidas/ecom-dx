'use client'

import { useState, useEffect } from 'react'
import { HistoryItem, getDiagnosisHistory, deleteDiagnosis } from '@/lib/saveService'
import { useAuth } from '@/lib/auth'
import { useToastContext } from '@/components/ToastProvider'
import useTranslations from '@/hooks/useTranslations'
import HistoryDetailModal from './HistoryDetailModal'
import { getATCComparison, getCBComparison, getCRComparison } from '@/lib/metricsHelpers'

interface HistoryModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function HistoryModal({ isOpen, onClose }: HistoryModalProps) {
  const { t } = useTranslations()
  const { user } = useAuth()
  const { showSuccess, showError } = useToastContext()
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null)

  // Cargar historial cuando se abre el modal
  useEffect(() => {
    if (isOpen && user) {
      loadHistory()
    }
  }, [isOpen, user])

  const loadHistory = async () => {
    if (!user) return

    setLoading(true)
    try {
      const historyData = await getDiagnosisHistory(user)
      setHistory(historyData)
    } catch (error) {
      console.error('Error cargando historial:', error)
      showError('Error cargando historial')
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetail = (item: HistoryItem) => {
    setSelectedItem(item)
    setShowDetailModal(true)
  }


  const handleDelete = async (yyyymm: string) => {
    if (!user) return

    setDeleting(yyyymm)
    try {
      await deleteDiagnosis(user, yyyymm)
      setHistory(prev => prev.filter(item => item.yyyymm !== yyyymm))
      showSuccess('Diagnóstico eliminado')
    } catch (error) {
      console.error('Error eliminando diagnóstico:', error)
      showError('Error eliminando diagnóstico')
    } finally {
      setDeleting(null)
    }
  }

  const formatDate = (yyyymm: string) => {
    const year = yyyymm.substring(0, 4)
    const month = yyyymm.substring(4, 6)
    const date = new Date(parseInt(year), parseInt(month) - 1)
    return date.toLocaleDateString('es-ES', { 
      month: 'short', 
      year: 'numeric' 
    })
  }

  const getDiagnosisLabel = (dx: string) => {
    const labels = {
      trafico: 'Tráfico',
      pagina_oferta: 'Página/Oferta',
      checkout_confianza: 'Checkout/Confianza',
      escalar: 'Escalar'
    }
    return labels[dx as keyof typeof labels] || dx
  }

  const getOverallStatus = (item: HistoryItem) => {
    const atcComparison = getATCComparison(item.atc * 100)
    const cbComparison = getCBComparison(item.cb * 100)
    const crComparison = getCRComparison(item.cr * 100)
    
    // Contar cuántas métricas están por encima, en rango, o por debajo
    const aboveCount = [atcComparison.status, cbComparison.status, crComparison.status].filter(s => s === 'above').length
    const equalCount = [atcComparison.status, cbComparison.status, crComparison.status].filter(s => s === 'equal').length
    const belowCount = [atcComparison.status, cbComparison.status, crComparison.status].filter(s => s === 'below').length
    
    if (aboveCount >= 2) {
      return { status: 'excellent', label: 'Por encima del promedio', color: 'green' }
    } else if (equalCount >= 2 || (aboveCount === 1 && equalCount === 1)) {
      return { status: 'good', label: 'En el rango normal', color: 'blue' }
    } else {
      return { status: 'needs_improvement', label: 'Por debajo del promedio', color: 'red' }
    }
  }

  const getDiagnosisMessage = (dx: string) => {
    const messages = {
      trafico: 'Pocas visitas y baja conversión',
      pagina_oferta: 'Buen tráfico pero baja conversión a carrito',
      checkout_confianza: 'Buena conversión a carrito pero baja conversión de carrito',
      escalar: '¡Excelente! Todo funcionando bien'
    }
    return messages[dx as keyof typeof messages] || 'Diagnóstico realizado'
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              {t('history.title')}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Cargando historial...</span>
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 text-6xl mb-4">📊</div>
              <p className="text-gray-600 text-lg mb-2">
                {t('history.empty')}
              </p>
              <button
                onClick={onClose}
                className="btn-primary"
              >
                {t('history.newDiag')}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-gray-300 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <h3 className="font-semibold text-gray-900 text-lg">
                          {formatDate(item.yyyymm)}
                        </h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          item.dx === 'escalar' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {item.dx === 'escalar' ? '¡Excelente!' : `Problema: ${getDiagnosisLabel(item.dx)}`}
                        </span>
                        {item.note && (
                          <span className="text-sm text-gray-600 italic">
                            "{item.note}"
                          </span>
                        )}
                      </div>
                      
                      <div className="mb-3">
                        <p className="text-gray-700 text-sm mb-2">
                          {getDiagnosisMessage(item.dx)}
                        </p>
                        {(() => {
                          const overallStatus = getOverallStatus(item)
                          return (
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              overallStatus.color === 'green' ? 'bg-green-100 text-green-800' :
                              overallStatus.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              Estado: {overallStatus.label}
                            </span>
                          )
                        })()}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 sm:ml-4">
                      <button
                        onClick={() => handleViewDetail(item)}
                        className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 transition-colors font-medium"
                      >
                        Ver detalle
                      </button>
                      <button
                        onClick={() => handleDelete(item.yyyymm)}
                        disabled={deleting === item.yyyymm}
                        className="px-3 py-1.5 border border-red-300 text-red-600 text-xs rounded-md hover:bg-red-50 disabled:opacity-50 transition-colors font-medium"
                      >
                        {deleting === item.yyyymm ? 'Eliminando...' : 'Eliminar'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal de detalle */}
      <HistoryDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        historyItem={selectedItem}
      />
    </div>
  )
}
