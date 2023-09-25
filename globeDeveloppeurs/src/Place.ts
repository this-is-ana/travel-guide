export interface Place {
    id: number
    id_ville: number
    nom: string
    imageLieu: string
    description: string
    latitude: number
    longitude: number
    visibilite: boolean
    id_createur: string

    constructor (
        id: number,
        id_ville: number,
        nom: string,
        imageLieu: string,
        description: string,
        latitude: number,
        longitude: number,
        visibilite: boolean,
        id_createur: string
        ) : Place
}