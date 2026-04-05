import { AirCraft } from './Aircraft'
import { Projectile } from './Projectile'
import { InputHandler } from '../input/InputHandler'
import { Vec2 } from './Vec2'

export class GameLoop {
  private ctx: CanvasRenderingContext2D
  private lastTime: number = 0
  private running: boolean = false
  private avion: AirCraft
  private input: InputHandler

  // La liste de tous les missiles en vol en ce moment
  private missiles: Projectile[] = []

  // Temps d'attente entre deux tirs — évite de spammer Espace
  private cooldownTir: number = 0

  constructor(private canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext('2d')!
    this.avion = new AirCraft(canvas.width / 2, canvas.height / 2)
    this.input = new InputHandler()
  }

  demarrer(): void {
    this.running = true
    requestAnimationFrame(this.tick)
  }

  // Cette fonction est appelée automatiquement 60x par seconde
  private tick = (timestamp: number): void => {
    if (!this.running) return

    // dt = temps écoulé depuis la dernière frame en secondes
    const dt = Math.min((timestamp - this.lastTime) / 1000, 0.05)
    this.lastTime = timestamp

    this.mettreAJour(dt)
    this.dessiner()

    requestAnimationFrame(this.tick)
  }

  private mettreAJour(dt: number): void {
    this.gererClavier(dt)
    this.avion.update(dt)
    this.gererBords()
    this.mettreAJourMissiles(dt)
  }

  private gererClavier(dt: number): void {
    const vitesseCroisiere = 250
    // Tourner
    if (this.input.left) this.avion.heading -= this.avion.TURN_SPEED * dt
    if (this.input.right) this.avion.heading += this.avion.TURN_SPEED * dt

    // Accélérer
    if (this.input.up) {
      this.avion.speed = Math.min(this.avion.speed + 300 * dt, 500)
    } else if (this.input.down) {
      this.avion.speed = Math.max(this.avion.speed - 200 * dt, 100)
    } else {
      if (this.avion.speed > vitesseCroisiere) {
        this.avion.speed = Math.max(this.avion.speed - 150 * dt, vitesseCroisiere)
      } else {
        this.avion.speed = Math.min(this.avion.speed + 150 * dt, vitesseCroisiere)
      }
    }

    // Tir — on décrémente le cooldown à chaque frame
    this.cooldownTir -= dt

    // Si Espace appuyé ET cooldown terminé → on tire
    if (this.input.shoot && this.cooldownTir <= 0) {
      const missile = this.avion.tirer()

      // Si l'avion a encore des munitions (pas null)
      if (missile !== null) {
        this.missiles.push(missile) // ajouter à la liste
        this.cooldownTir = 3     // attendre 0.25s avant prochain tir
      }
    }
  }

  private mettreAJourMissiles(dt: number): void {
    // Faire avancer chaque missile
    for (const missile of this.missiles) {
      missile.avancer(dt)
    }

    // Supprimer les missiles morts de la liste
    // filter garde seulement ceux où estVivant = true
    this.missiles = this.missiles.filter(m => m.estVivant)
  }

  private gererBords(): void {
    const p = this.avion.pos
    const w = this.canvas.width
    const h = this.canvas.height
    if (p.x > w) this.avion.pos = new Vec2(0, p.y)
    if (p.x < 0) this.avion.pos = new Vec2(w, p.y)
    if (p.y > h) this.avion.pos = new Vec2(p.x, 0)
    if (p.y < 0) this.avion.pos = new Vec2(p.x, h)
  }

  private dessiner(): void {
    // Effacer l'écran
    this.ctx.fillStyle = '#0a0a0f'
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

    // Dessiner les missiles
    for (const missile of this.missiles) {
      missile.dessiner(this.ctx)
    }

    // Dessiner l'avion par dessus
    this.avion.draw(this.ctx, '#5DCAA5')
  }
}