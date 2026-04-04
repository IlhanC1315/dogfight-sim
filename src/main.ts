import { GameLoop } from "./core/GameLoop"

const canvas = document.getElementById('game') as HTMLCanvasElement
canvas.width = 900
canvas.height = 600

const loop = new GameLoop(canvas)
loop.start()