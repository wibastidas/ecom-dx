'use client'

import useTranslations from '@/hooks/useTranslations'

interface OverwriteConfirmProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  monthLabel: string
}

export default function OverwriteConfirm({ isOpen, onClose, onConfirm, monthLabel }: OverwriteConfirmProps) {
  const { t } = useTranslations()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          {t('save.existsTitle')}
        </h2>

        <p className="text-gray-700 mb-6">
          {t('save.existsText', { monthLabel })}
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            {t('save.backBtn')}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {t('save.overwriteBtn')}
          </button>
        </div>
      </div>
    </div>
  )
}
