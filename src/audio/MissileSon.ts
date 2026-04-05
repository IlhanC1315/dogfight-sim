export class MissileSon {
  private contexte: AudioContext

  constructor(contexte: AudioContext) {
    // On réutilise le même contexte audio que le moteur
    this.contexte = contexte
  }

  // Appelé au moment du tir — son de lancement fort et court
  jouerLancement(): void {
    // --- Son d'explosion de lancement ---
    const bruit      = this.contexte.createOscillator()
    const volume     = this.contexte.createGain()

    bruit.connect(volume)
    volume.connect(this.contexte.destination)

    bruit.type = 'sine'
    bruit.frequency.value = 150

    // Fort au départ puis ça descend vite
    volume.gain.setValueAtTime(0.3, this.contexte.currentTime)
    volume.gain.exponentialRampToValueAtTime(0.001, this.contexte.currentTime + 0.3)

    // La fréquence descend — effet "whoosh"
    bruit.frequency.setValueAtTime(150, this.contexte.currentTime)
    bruit.frequency.exponentialRampToValueAtTime(40, this.contexte.currentTime + 0.3)

    bruit.start(this.contexte.currentTime)
    bruit.stop(this.contexte.currentTime + 0.3)
  }

  // Retourne un son de fusée continu — à stopper quand le missile meurt
  creerSonFusee(): { stopper: () => void } {
    const oscillateur = this.contexte.createOscillator()
    const bruit       = this.contexte.createOscillator()
    const volumePrincipal = this.contexte.createGain()
    const volumeBruit     = this.contexte.createGain()

    oscillateur.connect(volumePrincipal)
    bruit.connect(volumeBruit)
    volumePrincipal.connect(this.contexte.destination)
    volumeBruit.connect(this.contexte.destination)

    // Son principal de fusée — grave et continu
    oscillateur.type = 'sawtooth'
    oscillateur.frequency.value = 80
    volumePrincipal.gain.value = 0.03

    // Bruit de fond — effet souffle
    bruit.type = 'triangle'
    bruit.frequency.value = 200
    volumeBruit.gain.value = 0.02

    oscillateur.start()
    bruit.start()

    // Retourne une fonction pour stopper le son quand le missile meurt
    return {
      stopper: () => {
        volumePrincipal.gain.setTargetAtTime(0, this.contexte.currentTime, 0.05)
        volumeBruit.gain.setTargetAtTime(0, this.contexte.currentTime, 0.05)
        setTimeout(() => {
          oscillateur.stop()
          bruit.stop()
        }, 200)
      }
    }
  }
}