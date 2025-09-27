import { useState, useCallback } from 'react'

export interface ToastData {
  type: 'success' | 'error' | 'info'
  title: string
  message?: string
  duration?: number
}

export interface ToastProps extends ToastData {
  id: string
  onClose: (id: string) => void
}

export default function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const addToast = useCallback((toastData: ToastData) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast: ToastProps = {
      id,
      ...toastData,
      onClose: removeToast
    }
    
    setToasts(prev => [...prev, newToast])
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const showSuccess = useCallback((title: string, message?: string) => {
    addToast({ type: 'success', title, message })
  }, [addToast])

  const showError = useCallback((title: string, message?: string) => {
    addToast({ type: 'error', title, message })
  }, [addToast])

  const showInfo = useCallback((title: string, message?: string) => {
    addToast({ type: 'info', title, message })
  }, [addToast])

  return {
    addToast,
    showSuccess,
    showError,
    showInfo,
    toasts
  }
}
