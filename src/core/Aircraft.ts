import { Vec2 } from "./Vec2";

export class AirCraft {
    public pos: Vec2
    public heading: number      // angle en radians — où l'avion pointe
    public speed: number        // pixels par seconde
    public hp: number           // points de vie
    public readonly radius = 12 // pour les collisions

    readonly TURN_SPEED = 2.5   // radians par seconde

    constructor(x: number, y: number) {
        this.pos = new Vec2(x, y)
        this.heading = 0
        this.speed = 150
        this.hp = 100
    }

    update(dt: number): void { //Avancer dans la direction du heading
        const dir = Vec2.fromAngle(this.heading)
        this.pos = this.pos.add(dir.scale(this.speed * dt))
    }

    steer(targetDir: Vec2, dt: number): void {
        const targetAngle = Math.atan2(targetDir.y, targetDir.x)
        let diff = targetAngle - this.heading

        while (diff > Math.PI) diff -= Math.PI * 2
        while (diff < -Math.PI) diff += Math.PI * 2

        const maxTurn = this.TURN_SPEED * dt
        this.heading += Math.max(-maxTurn, Math.min(maxTurn, diff))
    }

    draw(ctx: CanvasRenderingContext2D, color: string): void {
        ctx.save()
        ctx.translate(this.pos.x, this.pos.y)
        ctx.rotate(this.heading)

        // Triangle qui représente l'avion
        ctx.beginPath()
        ctx.moveTo(14, 0)       // pointe avant
        ctx.lineTo(-10, -8)     // aile gauche
        ctx.lineTo(-6, 0)       // creux arrière
        ctx.lineTo(-10, 8)      // aile droite
        ctx.closePath()

        ctx.fillStyle = color
        ctx.strokeStyle = 'rgba(255,255,255,0.2)'
        ctx.lineWidth = 1
        ctx.fill()
        ctx.stroke()

        ctx.restore()
    }

    isAlive(): boolean {
        return this.hp > 0
    }

    takeDamage(amount: number): void {
        this.hp = Math.max(0, this.hp - amount)
    }
}