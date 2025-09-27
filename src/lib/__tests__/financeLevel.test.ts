import { financeLevel } from '../financeLevel'

describe('financeLevel', () => {
  test('ROAS < 1 should return critical', () => {
    expect(financeLevel(0.5)).toBe('critical')
    expect(financeLevel(0.99)).toBe('critical')
  })

  test('ROAS = 1 should return fragile', () => {
    expect(financeLevel(1)).toBe('fragile')
  })

  test('ROAS = 2.00 should return fragile', () => {
    expect(financeLevel(2.00)).toBe('fragile')
  })

  test('ROAS between 1 and 2 should return fragile', () => {
    expect(financeLevel(1.5)).toBe('fragile')
    expect(financeLevel(1.99)).toBe('fragile')
  })

  test('ROAS > 2 should return strong', () => {
    expect(financeLevel(2.01)).toBe('strong')
    expect(financeLevel(3)).toBe('strong')
    expect(financeLevel(5)).toBe('strong')
  })

  test('null or invalid values should return null', () => {
    expect(financeLevel(null)).toBe(null)
    expect(financeLevel(undefined as any)).toBe(null)
    expect(financeLevel(NaN)).toBe(null)
    expect(financeLevel(Infinity)).toBe(null)
  })
})
