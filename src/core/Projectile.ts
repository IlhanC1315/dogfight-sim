import { Vec2 } from "./Vec2";
import { AirCraft } from "./Aircraft";


export class Projectile {
    public position: Vec2
    public direction: Vec2
    public speed: number
    public damage: number
    public tempsDeVie: number
    public estVivant: boolean
    public readonly radius = 6

    constructor(x: number, y: number, angle: number) {
        this.position = new Vec2(x, y)
        this.direction = Vec2.depuisAngle(angle)
        this.speed = 600
        this.damage = 50
        this.tempsDeVie = 2
        this.estVivant = true
    }

    avancer(dt: number): void {
        this.position = this.position.ajouter(this.direction.multiplier(this.speed * dt))
        this.tempsDeVie = this.tempsDeVie - dt
        if(this.tempsDeVie <= 0) {
            this.exploser()
        }
    }

    toucher(avion: AirCraft): void {
        avion.hp = avion.hp - this.damage
        this.exploser()
    }

    exploser(): void {
        this.estVivant = false
    }

    dessiner(ctx: CanvasRenderingContext2D): void {
        ctx.save()
        ctx.translate(this.position.x, this.position.y)
        ctx.rotate(Math.atan2(this.direction.y, this.direction.x))     // orienté dans la bonne direction

        ctx.beginPath()
        ctx.moveTo(-8, 0)          // début du trait
        ctx.lineTo(8, 0)           // fin du trait
        ctx.strokeStyle = '#FAC775' // couleur jaune
        ctx.lineWidth = 3
        ctx.lineCap = 'round'      // bouts arrondis
        ctx.stroke()

        ctx.restore()
    }
}