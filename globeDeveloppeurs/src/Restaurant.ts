export interface Restaurant {
    id: number
    id_ville: number
    nom: string
    imageResto: string
    specialite: string
    description: string
    cote: string
    budget: string
    contact: string
    siteWeb: string
    visibilite: boolean
    id_createur: string

    constructor (
        id: number,
        id_ville: number,
        nom: string,
        imageResto: string,
        specialite: string,
        description: string,
        cote: string,
        budget: string,
        contact: string,
        siteWeb: string,
        visibilite: boolean,
        id_createur: string
        ) : Restaurant
}