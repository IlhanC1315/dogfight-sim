export class Vec2 {
  constructor(public x: number, public y: number) {}

  // Additionner deux positions — ex: position + deplacement
  ajouter(v: Vec2): Vec2 {
    return new Vec2(this.x + v.x, this.y + v.y)
  }

  // Soustraire — ex: trouver la direction entre deux points
  soustraire(v: Vec2): Vec2 {
    return new Vec2(this.x - v.x, this.y - v.y)
  }

  // Multiplier par un nombre — ex: augmenter la vitesse
  multiplier(s: number): Vec2 {
    return new Vec2(this.x * s, this.y * s)
  }

  // La longueur du vecteur — ex: la vitesse totale
  longueur(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y)
  }

  // Rendre la longueur égale à 1 — ex: obtenir juste la direction
  normaliser(): Vec2 {
    const len = this.longueur()
    if (len === 0) return new Vec2(0, 0)
    return this.multiplier(1 / len)
  }

  // La distance entre deux points — ex: est-ce que le missile touche l'avion ?
  distanceVers(v: Vec2): number {
    const dx = v.x - this.x
    const dy = v.y - this.y
    return Math.sqrt(dx * dx + dy * dy)
  }

  // L'angle vers un autre point — ex: dans quelle direction est le joueur ?
  angleVers(v: Vec2): number {
    return Math.atan2(v.y - this.y, v.x - this.x)
  }

  // Glisser doucement entre deux points — ex: transition fluide
  interpoler(v: Vec2, t: number): Vec2 {
    return new Vec2(
      this.x + (v.x - this.x) * t,
      this.y + (v.y - this.y) * t
    )
  }

  // Faire tourner un vecteur d'un angle — ex: orienter le dessin de l'avion
  tourner(angle: number): Vec2 {
    return new Vec2(
      this.x * Math.cos(angle) - this.y * Math.sin(angle),
      this.x * Math.sin(angle) + this.y * Math.cos(angle)
    )
  }

  // Produit scalaire — ex: savoir si deux directions sont similaires
  produitScalaire(v: Vec2): number {
    return this.x * v.x + this.y * v.y
  }

  // Créer une direction depuis un angle — ex: convertir le heading en déplacement
  static depuisAngle(angle: number): Vec2 {
    return new Vec2(Math.cos(angle), Math.sin(angle))
  }
}