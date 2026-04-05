export class MoteurSon {
  public contexte: AudioContext
  private oscillateur: OscillatorNode
  private volume: GainNode
  private demarre: boolean = false

  constructor() {
    this.contexte    = new AudioContext()
    this.oscillateur = this.contexte.createOscillator()
    this.volume      = this.contexte.createGain()

    // Brancher oscillateur → volume → sortie audio
    this.oscillateur.connect(this.volume)
    this.volume.connect(this.contexte.destination)

    // Type de son — sawtooth = son de moteur rugueux
    this.oscillateur.type = 'sine'

    // Volume de base — pas trop fort
    this.volume.gain.value = 0.08
  }

  demarrer(): void {
    if (this.demarre) return
    this.oscillateur.start()
    this.demarre = true
  }

  // Appelé à chaque frame avec la vitesse actuelle de l'avion
  mettreAJour(vitesse: number): void {
    // La fréquence change selon la vitesse
    // vitesse 100 → 80hz (grave)
    // vitesse 500 → 220hz (aigu)
    const frequence = 80 + (vitesse - 100) * 0.35

    // Transition douce — pas de saut brutal
    this.oscillateur.frequency.setTargetAtTime(
      frequence,
      this.contexte.currentTime,
      0.1  // vitesse de transition en secondes
    )
  }

  couper(): void {
    this.volume.gain.setTargetAtTime(0, this.contexte.currentTime, 0.3)
  }
}