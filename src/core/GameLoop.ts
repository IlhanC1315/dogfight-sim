import { AirCraft } from './Aircraft'
import { Projectile } from './Projectile'
import { InputHandler } from '../input/InputHandler'
import { Vec2 } from './Vec2'
import { MoteurSon } from '../audio/MoteurSon'
import { MissileSon } from '../audio/MissileSon'

export class GameLoop {
  private ctx: CanvasRenderingContext2D
  private lastTime: number = 0
  private running: boolean = false
  private avion: AirCraft
  private input: InputHandler
  private moteur: MoteurSon = new MoteurSon()
  private missileSon: MissileSon
  private ennemi: AirCraft

  // La liste de tous les missiles en vol en ce moment
  private missiles: Projectile[] = []

  // Temps d'attente entre deux tirs — évite de spammer Espace
  private cooldownTir: number = 0

  constructor(private canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext('2d')!
    this.avion = new AirCraft(canvas.width / 2, canvas.height / 2)
    this.input = new InputHandler()
    this.moteur = new MoteurSon()
    this.ennemi = new AirCraft(300, 200)
    this.missileSon = new MissileSon(this.moteur.contexte)
  }

  demarrer(): void {
    this.running = true
    requestAnimationFrame(this.tick)
    // Démarrer le son au premier clic — règle du navigateur
    this.canvas.addEventListener('click', () => {
      this.moteur.demarrer()
    }, { once: true })  // once: true = s'exécute une seule fois
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
    this.moteur.mettreAJour(this.avion.speed)
    if (!this.ennemi.isAlive()) {
      console.log("Ennemi détruit !")
    }
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
        // Son de lancement
        this.missileSon.jouerLancement()

        // Son de fusée continu — stocké dans le missile
        const sonFusee = this.missileSon.creerSonFusee()
        missile.sonFusee = sonFusee  // ← on attache le son au missile
        this.missiles.push(missile) // ajouter à la liste
        this.cooldownTir = 3     // attendre 0.25s avant prochain tir
      }
    }
  }

  private mettreAJourMissiles(dt: number): void {
    // Faire avancer chaque missile
    for (const missile of this.missiles) {
      missile.avancer(dt)
      // Vérifier si le missile touche l'ennemi
      const distance = missile.position.distanceVers(this.ennemi.pos)
      if (distance < missile.radius + this.ennemi.radius) {
        missile.toucher(this.ennemi)
      }
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
    if (this.ennemi.isAlive()) {
      this.ennemi.draw(this.ctx, '#D85A30')
      this.ctx.fillStyle = '#D85A30'
      this.ctx.font = '14px monospace'
      this.ctx.fillText('HP : ' + this.ennemi.hp, this.ennemi.pos.x - 20, this.ennemi.pos.y - 25)
    }
    this.dessinerViseur()
  }

  private dessinerViseur(): void {
    // Distance du viseur devant l'avion
    const distanceViseur = 600

    // Position du viseur = position avion + direction × distance
    const direction = Vec2.depuisAngle(this.avion.heading)
    const posViseur = this.avion.pos.ajouter(direction.multiplier(distanceViseur))

    // Dessiner la croix
    const taille = 10
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)'
    this.ctx.lineWidth = 1

    // Trait horizontal
    this.ctx.beginPath()
    this.ctx.moveTo(posViseur.x - taille, posViseur.y)
    this.ctx.lineTo(posViseur.x + taille, posViseur.y)
    this.ctx.stroke()

    // Trait vertical
    this.ctx.beginPath()
    this.ctx.moveTo(posViseur.x, posViseur.y - taille)
    this.ctx.lineTo(posViseur.x, posViseur.y + taille)
    this.ctx.stroke()

    // Cercle autour de la croix
    this.ctx.beginPath()
    this.ctx.arc(posViseur.x, posViseur.y, taille, 0, Math.PI * 2)
    this.ctx.stroke()
  }
}