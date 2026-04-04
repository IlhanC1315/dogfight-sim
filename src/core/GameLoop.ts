import { InputHandler } from "../input/InputHandler"
import { AirCraft } from "./Aircraft"
import { Vec2 } from "./Vec2"

export class GameLoop {
  private ctx: CanvasRenderingContext2D
  private lastTime: number = 0
  private running: boolean = false
  private player: AirCraft
  private input: InputHandler

  constructor(private canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext('2d')!
    this.player = new AirCraft(canvas.width / 2, canvas.height / 2)
    this.player.heading = 0
    this.input = new InputHandler()
  }

  start(): void {
    this.running = true
    requestAnimationFrame(this.tick)
  }

  private tick = (timestamp: number): void => {
    if (!this.running) return

    const dt = Math.min((timestamp - this.lastTime) / 1000, 0.05)
    this.lastTime = timestamp

    this.update(dt)
    this.render()

    requestAnimationFrame(this.tick)
  }

  private update(dt: number): void {
    this.handleInput(dt)
    this.player.update(dt)
    this.wrapScreen()
  }

  private handleInput(dt: number): void {
    // Tourner gauche / droite
    if (this.input.left) this.player.heading -= this.player.TURN_SPEED * dt
    if (this.input.right) this.player.heading += this.player.TURN_SPEED * dt

    // Accélérer
    if (this.input.up) {
      this.player.speed = Math.min(this.player.speed + 200 * dt, 300)
    } else {
      // Décélération progressive
      this.player.speed = Math.max(this.player.speed - 80 * dt, 80)
    }
  }

  private wrapScreen(): void {
    const p = this.player.pos
    const w = this.canvas.width
    const h = this.canvas.height

    if (p.x > w) this.player.pos = new Vec2(0, p.y)
    if (p.x < 0) this.player.pos = new Vec2(w, p.y)
    if (p.y > h) this.player.pos = new Vec2(p.x, 0)
    if (p.y < 0) this.player.pos = new Vec2(p.x, h)
  }

  private render(): void {
    // Fond noir
    this.ctx.fillStyle = '#0a0a0f'
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

    // Dessiner l'avion
    this.player.draw(this.ctx, '#5DCAA5')
  }
}