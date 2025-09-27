'use client'

import { useAuth } from '@/lib/auth'
import { useState } from 'react'
import HistoryModal from './HistoryModal'

export default function Header() {
  const { user, signIn, signOut } = useAuth()
  const [showHistoryModal, setShowHistoryModal] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  const handleSignIn = async () => {
    try {
      await signIn()
      setShowMobileMenu(false)
    } catch (error) {
      console.error('Error al iniciar sesión:', error)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      setShowMobileMenu(false)
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }

  const handleHistoryClick = () => {
    setShowHistoryModal(true)
    setShowMobileMenu(false)
  }

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container-responsive py-4">
          <div className="flex items-center justify-between">
            {/* Logo/Título */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-gray-900">
                Radar E-commerce
              </h1>
            </div>

            {/* Desktop: Acciones de usuario */}
            <div className="hidden md:flex items-center space-x-3">
              {user ? (
                <>
                  <span className="text-sm text-gray-600">
                    {user.email}
                  </span>
                  <button
                    onClick={handleHistoryClick}
                    className="btn-outline-sm"
                  >
                    📊 Historial
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="btn-outline-sm"
                  >
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <button
                  onClick={handleSignIn}
                  className="btn-primary-sm"
                >
                  🔑 Iniciar sesión
                </button>
              )}
            </div>

            {/* Mobile: Menú hamburguesa */}
            <div className="md:hidden">
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="md:hidden mt-4 pt-4 border-t border-gray-200">
              <div className="space-y-3">
                {user ? (
                  <>
                    <div className="text-sm text-gray-600 px-2">
                      {user.email}
                    </div>
                    <button
                      onClick={handleHistoryClick}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700"
                    >
                      📊 Ver historial
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700"
                    >
                      Cerrar sesión
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleSignIn}
                    className="w-full text-left px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                  >
                    🔑 Iniciar sesión
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Modal de historial */}
      <HistoryModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
      />
    </>
  )
}
