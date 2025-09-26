import { diagnose } from '../diagnosis'

describe('Diagnosis Logic', () => {
  test('should classify as "trafico" when visits < 500 and good rates', () => {
    const result = diagnose(300, 15, 3) // visits, carts, purchases
    expect(result.dx).toBe('trafico')
    expect(result.atc).toBeCloseTo(0.05) // 15/300 = 0.05
    expect(result.cb).toBeCloseTo(0.20) // 3/15 = 0.20
    expect(result.cr).toBeCloseTo(0.01) // 3/300 = 0.01
  })

  test('should classify as "oferta_web" when ATC < 0.03', () => {
    const result = diagnose(1000, 20, 6) // ATC = 20/1000 = 0.02
    expect(result.dx).toBe('oferta_web')
    expect(result.atc).toBeCloseTo(0.02)
  })

  test('should classify as "checkout" when CB < 0.30', () => {
    const result = diagnose(1000, 80, 20) // CB = 20/80 = 0.25
    expect(result.dx).toBe('checkout')
    expect(result.cb).toBeCloseTo(0.25)
  })

  test('should classify as "escalar" when all rates are good', () => {
    const result = diagnose(2000, 100, 40) // ATC = 0.05, CB = 0.40
    expect(result.dx).toBe('escalar')
    expect(result.atc).toBeCloseTo(0.05)
    expect(result.cb).toBeCloseTo(0.40)
  })
})
