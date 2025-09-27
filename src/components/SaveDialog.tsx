'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from './AuthProvider'
import { signInWithGoogle } from '@/lib/auth'
import { DiagnosisResult } from '@/lib/diagnosis'

const saveSchema = z.object({
  month: z.string().min(1, 'El mes es requerido'),
  subscribeNewsletter: z.boolean().optional(),
})

type SaveFormData = z.infer<typeof saveSchema>

interface SaveDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (month: string, newsletterSubscribed?: boolean) => void
  result: DiagnosisResult
}

export default function SaveDialog({ isOpen, onClose, onSave, result }: SaveDialogProps) {
  const { user } = useAuth()
  const [isSaving, setIsSaving] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<SaveFormData>({
    resolver: zodResolver(saveSchema),
    defaultValues: {
      month: new Date().toISOString().slice(0, 7), // YYYY-MM format
      subscribeNewsletter: false,
    }
  })

  const watchedValues = watch()

  const handleGoogleSignIn = async () => {
    try {
      setIsSaving(true)
      await signInWithGoogle()
      
      // After successful login, capture newsletter subscription and save
      const newsletterSubscribed = watchedValues.subscribeNewsletter || false
      
      // Auto-save with current month and newsletter subscription
      onSave(watchedValues.month || new Date().toISOString().slice(0, 7), newsletterSubscribed)
      reset()
      onClose()
    } catch (error) {
      console.error('Error signing in:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const onSubmit = (data: SaveFormData) => {
    const newsletterSubscribed = data.subscribeNewsletter || false
    
    onSave(data.month, newsletterSubscribed)
    reset()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Guardar Diagnóstico
          </h3>
          <p className="text-gray-600 text-sm">
            Guarda este diagnóstico en tu historial para hacer seguimiento de tu progreso
          </p>
        </div>
        
        {!user ? (
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
              <p className="text-blue-800 text-sm">
                Para guardar tu diagnóstico y hacer seguimiento de tu progreso, 
                necesitas iniciar sesión con Google.
              </p>
            </div>

            {/* Newsletter Subscription - Visible for non-logged users */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  <input
                    type="checkbox"
                    id="subscribeNewsletterLogin"
                    {...register('subscribeNewsletter')}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="subscribeNewsletterLogin" className="text-sm font-semibold text-gray-900 cursor-pointer">
                    📧 Recibir tips de e-commerce
                  </label>
                  <p className="text-xs text-gray-600 mt-1">
                    Consejos prácticos, tendencias del mercado y estrategias para mejorar tus ventas online
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={handleGoogleSignIn}
                disabled={isSaving}
                className="w-full btn-primary disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {isSaving ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Iniciando sesión...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Iniciar sesión con Google
                  </>
                )}
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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="bg-green-50 p-4 rounded-xl border border-green-200">
              <p className="text-green-800 text-sm mb-3">
                ¡Hola <strong>{user.displayName}</strong>! ¿Quieres guardar este diagnóstico?
              </p>
              
              <div className="bg-white p-3 rounded-lg border border-green-200">
                <div className="text-sm text-gray-700 mb-2">
                  <strong>Diagnóstico:</strong> {result.dx}
                </div>
                <div className="text-sm text-gray-700">
                  <strong>Métricas:</strong> ATC: {(result.atc * 100).toFixed(1)}%, CB: {(result.cb * 100).toFixed(1)}%, CR: {(result.cr * 100).toFixed(1)}%
                </div>
              </div>
            </div>

            {/* Month Selection */}
            <div className="form-group">
              <label htmlFor="month" className="form-label">
                📅 Mes del diagnóstico
              </label>
              <input
                type="month"
                id="month"
                {...register('month')}
                className="input-field"
              />
              {errors.month && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.month.message}
                </p>
              )}
            </div>

            {/* Newsletter Subscription */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  <input
                    type="checkbox"
                    id="subscribeNewsletter"
                    {...register('subscribeNewsletter')}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="subscribeNewsletter" className="text-sm font-semibold text-gray-900 cursor-pointer">
                    📧 Recibir tips de e-commerce
                  </label>
                  <p className="text-xs text-gray-600 mt-1">
                    Consejos prácticos, tendencias del mercado y estrategias para mejorar tus ventas online
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <button
                type="submit"
                className="w-full btn-primary flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Guardar Diagnóstico
              </button>
              
              <button
                type="button"
                onClick={onClose}
                className="w-full btn-secondary"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
