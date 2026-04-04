export class InputHandler {
    private keys: Set<string> = new Set()

    constructor() {
        window.addEventListener('keydown', e => this.keys.add(e.code))
        window.addEventListener('keyup', e => this.keys.delete(e.code))
    }

    get left(): boolean { return this.keys.has('ArrowLeft') || this.keys.has('KeyQ') }
    get right(): boolean { return this.keys.has('ArrowRight') || this.keys.has('KeyD') }
    get up(): boolean { return this.keys.has('ArrowUp') || this.keys.has('KeyZ') }
    get shoot(): boolean { return this.keys.has('Space') }
}