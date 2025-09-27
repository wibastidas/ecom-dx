'use client'

import { useState, useEffect } from 'react'

export interface ToastProps {
  id: string
  type: 'success' | 'error' | 'info'
  title: string
  message?: string
  duration?: number
  onClose: (id: string) => void
}

export default function Toast({ id, type, title, message, duration = 4000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Mostrar toast con animación
    const showTimer = setTimeout(() => setIsVisible(true), 100)
    
    // Auto-cerrar después de la duración
    const hideTimer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(() => onClose(id), 300) // Esperar animación de salida
    }, duration)

    return () => {
      clearTimeout(showTimer)
      clearTimeout(hideTimer)
    }
  }, [id, duration, onClose])

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅'
      case 'error':
        return '❌'
      case 'info':
        return 'ℹ️'
      default:
        return 'ℹ️'
    }
  }

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200'
      case 'error':
        return 'bg-red-50 border-red-200'
      case 'info':
        return 'bg-blue-50 border-blue-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  const getTextColor = () => {
    switch (type) {
      case 'success':
        return 'text-green-800'
      case 'error':
        return 'text-red-800'
      case 'info':
        return 'text-blue-800'
      default:
        return 'text-gray-800'
    }
  }

  return (
    <div
      className={`
        fixed top-4 right-4 z-50 max-w-sm w-full
        transform transition-all duration-300 ease-in-out
        ${isVisible 
          ? 'translate-x-0 opacity-100' 
          : 'translate-x-full opacity-0'
        }
      `}
    >
      <div className={`
        p-4 rounded-lg border shadow-lg
        ${getBgColor()}
      `}>
        <div className="flex items-center">
          <div className="flex-shrink-0 text-lg mr-3">
            {getIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium ${getTextColor()}`}>
              {title}
            </p>
            {message && (
              <p className={`text-xs mt-1 ${getTextColor()} opacity-80`}>
                {message}
              </p>
            )}
          </div>
          <button
            onClick={() => {
              setIsVisible(false)
              setTimeout(() => onClose(id), 300)
            }}
            className={`
              flex-shrink-0 ml-2 text-lg leading-none
              ${getTextColor()} opacity-60 hover:opacity-100
            `}
          >
            ×
          </button>
        </div>
      </div>
    </div>
  )
}
