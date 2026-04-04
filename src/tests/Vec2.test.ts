import { describe, it, expect } from 'vitest'
import { Vec2 } from '../core/Vec2'

describe('Vec2', () => {
  it('additionne deux vecteurs', () => {
    const a = new Vec2(1, 2)
    const b = new Vec2(3, 4)
    expect(a.add(b)).toEqual(new Vec2(4, 6))
  })

  it('normalise un vecteur', () => {
    const v = new Vec2(3, 4)
    const n = v.normalize()
    expect(n.length()).toBeCloseTo(1)
  })

  it('retourne (0,0) si on normalise un vecteur nul', () => {
    const v = new Vec2(0, 0)
    expect(v.normalize()).toEqual(new Vec2(0, 0))
  })

  // Les tests pour rotate, angleTo, lerp — à toi de les écrire !
})