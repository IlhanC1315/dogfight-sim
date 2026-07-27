import { EtatIA } from "./EtatIA";
import { AirCraft } from "../core/Aircraft";
import { Vec2 } from "../core/Vec2";

export class EnnemyAi {
    public ennemyEtat: EtatIA = EtatIA.PATROL
    private indexWaypoint: number = 0
    private waypoints: Vec2[]

    constructor(private avion: AirCraft, largeur: number, hauteur: number) {
        this.waypoints = [
            new Vec2(100, 100),
            new Vec2(largeur - 100, 100),
            new Vec2(largeur - 100, hauteur - 100),
            new Vec2(100, hauteur - 100),
        ]
    }

}