'use client'

// MVP: Autenticación e historial comentados – solo logo. Botón "Iniciar sesión" desactivado.
// Más adelante remover comentarios para restaurar.
// import { useAuth } from '@/lib/auth'
// import { useState } from 'react'
// import HistoryModal from './HistoryModal'

export default function Header() {
  // const { user, signIn, signOut } = useAuth()
  // const [showHistoryModal, setShowHistoryModal] = useState(false)
  // const [showMobileMenu, setShowMobileMenu] = useState(false)

  // const handleSignIn = async () => {
  //   try {
  //     await signIn()
  //     setShowMobileMenu(false)
  //   } catch (error) {
  //     console.error('Error al iniciar sesión:', error)
  //   }
  // }

  // const handleSignOut = async () => {
  //   try {
  //     await signOut()
  //     setShowMobileMenu(false)
  //   } catch (error) {
  //     console.error('Error al cerrar sesión:', error)
  //   }
  // }

  // const handleHistoryClick = () => {
  //   setShowHistoryModal(true)
  //   setShowMobileMenu(false)
  // }

  const handleLogoClick = () => {
    window.location.href = '/'
  }

  return (
    <>
      <header className="glass-nav sticky top-0 z-50">
        <div className="container-responsive py-4">
          <div className="flex items-center justify-between">
            {/* Logo/Título */}
            <button
              onClick={handleLogoClick}
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-200 cursor-pointer"
            >
              <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-amber-50 border border-amber-200 shadow-sm">
                <img
                  src="/logo.svg"
                  alt="Radar E-commerce"
                  className="w-6 h-6"
                />
              </div>
              <div className="flex flex-col items-start">
                <span className="text-xl font-bold bg-gradient-to-r from-stone-900 to-amber-700 bg-clip-text text-transparent leading-tight">
                  Radar E-commerce
                </span>
                <span className="text-xs text-slate-400 font-normal leading-tight tracking-wide">
                  Diagnóstico de conversión
                </span>
              </div>
            </button>

            {/* MVP: Botón Iniciar sesión DESACTIVADO – comentado. Solo logo visible. */}
            {/* Desktop: Iniciar sesión, Ver Historial, Cerrar sesión – todo comentado */}
            {/* <div className="hidden md:flex items-center space-x-3">
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
            </div> */}

            {/* MVP: Menú móvil con Iniciar sesión – comentado */}
            {/* Mobile: Menú hamburguesa */}
            {/* <div className="md:hidden">
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div> */}
          </div>

          {/* MVP: Mobile menu con Iniciar sesión – comentado */}
          {/* Mobile Menu */}
          {/* {showMobileMenu && (
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
          )} */}
        </div>
      </header>

      {/* MVP: Modal de historial comentado */}
      {/* <HistoryModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
      /> */}
    </>
  )
}
