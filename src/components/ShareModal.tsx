'use client'

import { useState } from 'react'
import useTranslations from '@/hooks/useTranslations'
import { useAuth } from '@/lib/auth'
import { saveSharing } from '@/lib/saveService'

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  diagnosisData: {
    dx: string
    visits: number
    carts: number
    orders: number
    atc: number
    cb: number
    cr: number
  }
}

export default function ShareModal({ isOpen, onClose, diagnosisData }: ShareModalProps) {
  const { t } = useTranslations()
  const { user } = useAuth()

  // Generar mensaje genérico
  const generateMessage = () => {
    return `Hola! Te comparto esta herramienta súper útil para diagnosticar tu tienda online:

🔍 Radar E-commerce: https://radar-ecommerce.com

En 30 segundos te dice exactamente dónde está tu problema y qué hacer para vender más. ¡Es gratis y súper fácil de usar!`
  }

  const handleWhatsApp = async () => {
    const message = generateMessage()
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
    
    // Si está logueado, guardar el sharing en Firebase
    if (user) {
      try {
        await saveSharing(user, diagnosisData)
        console.log('Sharing guardado en Firebase')
      } catch (error) {
        console.error('Error guardando sharing:', error)
        // No mostrar error al usuario, es solo tracking
      }
    }
    
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Compartir herramienta
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            &times;
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>🎁 Bonus:</strong> Si tu amigo usa esta herramienta, te enviaremos un checklist extra para optimizar tu AOV.
            </p>
          </div>

          <div className="text-center">
            <button
              onClick={handleWhatsApp}
              className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 text-lg font-semibold"
            >
              <span>📱</span>
              <span>Compartir por WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
