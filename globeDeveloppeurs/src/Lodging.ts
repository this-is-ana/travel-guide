export interface Lodging {
    id: number
        id_ville: number
        nom: string
        imageHebergement: string
        description: string
        cote: number
        categorie: string
        siteWeb: string
        latitude: number
        longitude: number
        visibilite: boolean
        id_createur: string
    
    constructor (
        id: number,
        id_ville: number,
        nom: string,
        imageHebergement: string,
        description: string,
        cote: number,
        categorie: string,
        siteWeb: string,
        latitude: number,
        longitude: number,
        visibilite: boolean,
        id_createur: string
        ) : Lodging
}