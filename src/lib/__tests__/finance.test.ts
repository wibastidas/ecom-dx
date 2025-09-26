import { evaluateFinance } from '../finance'

describe('Finance Logic', () => {
  test('should return critical level when ROAS < 1', () => {
    const result = evaluateFinance({
      aov: 100,
      roas: 0.75,
      cac: 80,
      ordersCount: 15
    })
    
    expect(result.level).toBe('critical')
    expect(result.headline).toContain('Por cada $1 que invertiste en anuncios, volvieron $0.75')
    expect(result.summary).toContain('Hoy tus anuncios no se pagan solos')
  })

  test('should return fragile level when ROAS 1-2', () => {
    const result = evaluateFinance({
      aov: 40,
      roas: 1.50,
      cac: 26.67,
      ordersCount: 15
    })
    
    expect(result.level).toBe('fragile')
    expect(result.headline).toContain('Por cada $1 que invertiste en anuncios, volvieron $1.50')
    expect(result.summary).toContain('Tus anuncios cubren su costo, pero todavía no dejan margen')
  })

  test('should return strong level when ROAS > 2 and CAC < AOV', () => {
    const result = evaluateFinance({
      aov: 80,
      roas: 4.00,
      cac: 20,
      ordersCount: 15
    })
    
    expect(result.level).toBe('strong')
    expect(result.headline).toContain('Por cada $1 que invertiste en anuncios, volvieron $4.00')
    expect(result.summary).toContain('Buen trabajo: tus anuncios generan más de lo que cuestan')
  })

  test('should return fragile when CAC > AOV', () => {
    const result = evaluateFinance({
      aov: 40,
      roas: 1.20,
      cac: 33.33,
      ordersCount: 15
    })
    
    expect(result.level).toBe('fragile')
    expect(result.summary).toContain('Estás pagando más por conseguir un cliente de lo que te deja su compra')
  })

  test('should return ok when CAC ≈ AOV', () => {
    const result = evaluateFinance({
      aov: 60,
      roas: 2.00,
      cac: 30,
      ordersCount: 15
    })
    
    expect(result.level).toBe('ok')
    expect(result.summary).toContain('Estás empatando: por cada cliente que ganás')
  })

  test('should include small sample note when ordersCount < 10', () => {
    const result = evaluateFinance({
      aov: 50,
      roas: 2.00,
      cac: 25,
      ordersCount: 5
    })
    
    expect(result.notes).toContain('Muestra chica: con menos de 10 pedidos, tomá estas señales con cautela.')
  })
})
