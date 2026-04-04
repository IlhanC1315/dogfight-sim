export class Vec2 {
  constructor(public x: number, public y: number) { }

  add(v: Vec2): Vec2 {
    return new Vec2(this.x + v.x, this.y + v.y)
  }

  sub(v: Vec2): Vec2 {
    return new Vec2(this.x - v.x, this.y - v.y)
  }

  scale(s: number): Vec2 {
    return new Vec2(this.x * s, this.y * s)
  }

  length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y)
  }

  normalize(): Vec2 {
    const len = this.length()
    if (len === 0) return new Vec2(0, 0)
    return this.scale(1 / len)
  }

  dot(v: Vec2): number {
    return this.x * v.x + this.y * v.y
  }

  // TODO Phase 1 — à implémenter toi-même :
  // rotate(angle: number): Vec2
  // angleTo(v: Vec2): number
  // lerp(v: Vec2, t: number): Vec2
  // distanceTo(v: Vec2): number
  // static fromAngle(angle: number): Vec2

  distanc(v: Vec2): number {
    const dx = v.x - this.x
    const dy = v.y - this.y
    return Math.sqrt(dx * dx + dy * dy)
  };

  static fromAngle(angle: number): Vec2 {
    return new Vec2(Math.cos(angle), Math.sin(angle))
  }

  lerp(v: Vec2, t: number): Vec2 {
    return new Vec2(
      this.x + (v.x - this.x) * t,
      this.y + (v.y - this.y) * t
    )
  };

  angleTo(v: Vec2): number {
    return Math.atan2(v.y - this.y, v.x - this.x)
  };

  rotate(angle: number): Vec2 {
    return new Vec2(
      this.x * Math.cos(angle) - this.y * Math.sin(angle),
      this.x * Math.sin(angle) + this.y * Math.cos(angle)
    )
  };

  
}