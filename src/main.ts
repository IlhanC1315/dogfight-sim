import { GameLoop } from "./core/GameLoop"

const canvas = document.getElementById('game') as HTMLCanvasElement
canvas.width = 1800
canvas.height = 900

const loop = new GameLoop(canvas)
loop.demarrer()