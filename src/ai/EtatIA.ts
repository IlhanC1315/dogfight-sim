export enum EtatIA {
    PATROL, // L'avion patrouille fait des rondes
    CHASE, // Il détecte un énnemi et le chasse
    ATTACK, // Des qu'il est prêt il attaque l'énnemi
    EVADE, // Mode esquive de projectile
    DISENGAGE // Ses Hp sont faibles il s'échappe
}