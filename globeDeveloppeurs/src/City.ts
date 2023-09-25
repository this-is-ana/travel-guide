export interface City {
    id: number
    nom: string
    pays: string
    imageAccueil: string
    imageDetails: string
    description: string
    latitude: number
    longitude: number
    codeAeroport: string
    visibilite: boolean

    constructor (id: number, nom: string, pays: string, imageAccueil: string, imageDetails: string, description: string, latitude: number, longitude: number, codeAeroport: string, visibilite: boolean) : City
}