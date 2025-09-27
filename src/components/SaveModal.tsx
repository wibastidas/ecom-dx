'use client'

import { useState, useEffect } from 'react'
import { DateTime } from 'luxon'
import useTranslations from '@/hooks/useTranslations'
import { checkDiagnosisExists, saveDiagnosis, updateDiagnosis } from '@/lib/saveService'
import { useAuth } from '@/lib/auth'
import { useToastContext } from '@/components/ToastProvider'
import OverwriteConfirm from './OverwriteConfirm'

interface SaveModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: SaveData) => void
  diagnosisData: DiagnosisData
}

interface SaveData {
  yyyymm: string
  monthLabel: string
  note: string
}

interface DiagnosisData {
  dx: string
  visits: number
  carts: number
  orders: number
  atc: number
  cb: number
  cr: number
  sales?: number | null
  adspend?: number | null
  ordersCount?: number | null
  aov?: number | null
  roas?: number | null
  cac?: number | null
}

export default function SaveModal({ isOpen, onClose, onSave, diagnosisData }: SaveModalProps) {
  const { t } = useTranslations()
  const { user } = useAuth()
  const { showSuccess, showError } = useToastContext()
  const [selectedMonth, setSelectedMonth] = useState('')
  const [note, setNote] = useState('')
  const [monthOptions, setMonthOptions] = useState<Array<{value: string, label: string}>>([])
  const [showOverwrite, setShowOverwrite] = useState(false)
  const [saving, setSaving] = useState(false)
  const [monthLabel, setMonthLabel] = useState('')

  // Configurar mes actual como default
  useEffect(() => {
    if (isOpen) {
      const nowUy = DateTime.now().setZone('America/Montevideo')
      const currentMonth = nowUy.toFormat('yyyy-LL')
      setSelectedMonth(currentMonth)
      
      // Generar opciones de meses (últimos 24 + próximos 3)
      const options = []
      for (let i = 23; i >= 0; i--) {
        const month = nowUy.minus({ months: i })
        options.push({
          value: month.toFormat('yyyy-LL'),
          label: month.toFormat('LLL yyyy')
        })
      }
      for (let i = 1; i <= 3; i++) {
        const month = nowUy.plus({ months: i })
        options.push({
          value: month.toFormat('yyyy-LL'),
          label: month.toFormat('LLL yyyy')
        })
      }
      setMonthOptions(options)
    }
  }, [isOpen])

  const handleSave = async () => {
    if (!user) {
      console.error('Usuario no autenticado')
      return
    }

    setSaving(true)
    
    try {
      const selectedDate = DateTime.fromFormat(selectedMonth, 'yyyy-LL').setZone('America/Montevideo')
      const yyyymm = selectedDate.toFormat('yyyyLL')
      const monthLabel = selectedDate.toFormat('LLL yyyy')
      
      // Verificar si ya existe un diagnóstico para este mes
      const exists = await checkDiagnosisExists(user.uid, yyyymm)
      
      if (exists) {
        setMonthLabel(monthLabel)
        setShowOverwrite(true)
        setSaving(false)
        return
      }
      
      // Si no existe, guardar directamente
      await performSave(yyyymm, monthLabel)
    } catch (error) {
      console.error('Error al guardar:', error)
      showError(t('save.error'))
    } finally {
      setSaving(false)
    }
  }

  const performSave = async (yyyymm: string, monthLabel: string) => {
    if (!user) return

    try {
      const saveData = {
        yyyymm,
        monthLabel,
        dx: diagnosisData.dx,
        visits: diagnosisData.visits,
        carts: diagnosisData.carts,
        orders: diagnosisData.orders,
        atc: diagnosisData.atc,
        cb: diagnosisData.cb,
        cr: diagnosisData.cr,
        sales: diagnosisData.sales,
        adspend: diagnosisData.adspend,
        ordersCount: diagnosisData.ordersCount,
        aov: diagnosisData.aov,
        roas: diagnosisData.roas,
        cac: diagnosisData.cac,
        note: note.trim()
      }

      await saveDiagnosis(user, saveData)
      
      // Llamar callback del componente padre
      onSave({
        yyyymm,
        monthLabel,
        note: note.trim()
      })
      
      // Cerrar modal
      onClose()
      
      // Mostrar toast de éxito
      showSuccess(t('save.success', { monthLabel }))
    } catch (error) {
      console.error('Error al guardar diagnóstico:', error)
      showError(t('save.error'))
    }
  }

  const handleOverwriteConfirm = async () => {
    if (!user) return

    setSaving(true)
    setShowOverwrite(false)
    
    try {
      const selectedDate = DateTime.fromFormat(selectedMonth, 'yyyy-LL').setZone('America/Montevideo')
      const yyyymm = selectedDate.toFormat('yyyyLL')
      const monthLabel = selectedDate.toFormat('LLL yyyy')
      
      const saveData = {
        yyyymm,
        monthLabel,
        dx: diagnosisData.dx,
        visits: diagnosisData.visits,
        carts: diagnosisData.carts,
        orders: diagnosisData.orders,
        atc: diagnosisData.atc,
        cb: diagnosisData.cb,
        cr: diagnosisData.cr,
        sales: diagnosisData.sales,
        adspend: diagnosisData.adspend,
        ordersCount: diagnosisData.ordersCount,
        aov: diagnosisData.aov,
        roas: diagnosisData.roas,
        cac: diagnosisData.cac,
        note: note.trim()
      }

      await updateDiagnosis(user, saveData)
      
      // Llamar callback del componente padre
      onSave({
        yyyymm,
        monthLabel,
        note: note.trim()
      })
      
      // Cerrar modal
      onClose()
      
      // Mostrar toast de éxito
      showSuccess(t('save.success', { monthLabel }))
    } catch (error) {
      console.error('Error al actualizar diagnóstico:', error)
      showError(t('save.error'))
    } finally {
      setSaving(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          {t('save.openTitle')}
        </h2>

        {/* Selector de mes */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('save.monthLabel')}
          </label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {monthOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <p className="text-sm text-gray-600 mt-1">
            {t('save.monthHelp')}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {t('save.monthDefaultHint')}
          </p>
        </div>

        {/* Campo nota */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('save.noteLabel')}
          </label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={t('save.notePlaceholder')}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Texto de privacidad */}
        <p className="text-xs text-gray-500 mb-6">
          {t('save.privacy')}
        </p>

        {/* Botones */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            {t('save.cancelBtn')}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Guardando...' : t('save.saveBtn')}
          </button>
        </div>
      </div>

      {/* Modal de confirmación de sobrescritura */}
      <OverwriteConfirm
        isOpen={showOverwrite}
        onClose={() => setShowOverwrite(false)}
        onConfirm={handleOverwriteConfirm}
        monthLabel={monthLabel}
      />
    </div>
  )
}
