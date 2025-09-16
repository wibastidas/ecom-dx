'use client'

import { useState } from 'react'
import { useAuth } from './AuthProvider'
import { signInWithGoogle } from '@/lib/auth'
import { DiagnosisResult } from '@/lib/diagnosis'

interface SaveDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: () => void
  result: DiagnosisResult
}

export default function SaveDialog({ isOpen, onClose, onSave, result }: SaveDialogProps) {
  const { user } = useAuth()
  const [isSaving, setIsSaving] = useState(false)

  const handleGoogleSignIn = async () => {
    try {
      setIsSaving(true)
      await signInWithGoogle()
      // After successful login, the user will be available in the context
      // and we can proceed to save
    } catch (error) {
      console.error('Error signing in:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleSave = () => {
    onSave()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Guardar Diagnóstico
        </h3>
        
        {!user ? (
          <div className="space-y-4">
            <p className="text-gray-600">
              Para guardar tu diagnóstico y hacer seguimiento de tu progreso, 
              necesitas iniciar sesión con Google.
            </p>
            
            <div className="space-y-3">
              <button
                onClick={handleGoogleSignIn}
                disabled={isSaving}
                className="w-full btn-primary disabled:opacity-50"
              >
                {isSaving ? 'Iniciando sesión...' : 'Iniciar sesión con Google'}
              </button>
              
              <button
                onClick={onClose}
                className="w-full btn-secondary"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-600">
              ¡Hola {user.displayName}! ¿Quieres guardar este diagnóstico en tu historial?
            </p>
            
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm text-gray-600">
                <strong>Diagnóstico:</strong> {result.dx}
              </div>
              <div className="text-sm text-gray-600">
                <strong>Métricas:</strong> CV: {result.cv.toFixed(1)}%, CC: {result.cc.toFixed(1)}%, TC: {result.tc.toFixed(1)}%
              </div>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={handleSave}
                className="w-full btn-primary"
              >
                Guardar Diagnóstico
              </button>
              
              <button
                onClick={onClose}
                className="w-full btn-secondary"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
