export const track = (event: string, props: Record<string, any> = {}) => {
  if (typeof window !== 'undefined') {
    // Google Tag Manager
    if ((window as any).dataLayer) {
      (window as any).dataLayer.push({ event, ...props })
    }
    
    // Google Analytics 4
    if ((window as any).gtag) {
      (window as any).gtag('event', event, props)
    }
    
    // Console log for development
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics Event:', event, props)
    }
  }
}

// Eventos específicos del diagnóstico
export const trackDiagnosisStart = () => {
  track('diag_start')
}

export const trackDiagnosisSubmit = (visits: number, carts: number, purchases: number) => {
  track('diag_submit', { visits, carts, purchases })
}

export const trackDiagnosisResultView = (diagnosis: string, cv: number, cc: number, tc: number) => {
  track('diag_result_view', { diagnosis, cv, cc, tc })
}

export const trackSalesPageView = () => {
  track('salespage_view')
}

export const trackSalesPageCtaClick = () => {
  track('salespage_cta_click')
}

export const trackCalendarView = () => {
  track('calendar_view')
}

export const trackCalendarBooked = () => {
  track('calendar_booked')
}
