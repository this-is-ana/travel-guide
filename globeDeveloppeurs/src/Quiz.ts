export interface Quiz {
    id: number
    id_ville: number
    question: string
    choixA: string
    choixB: string
    choixC: string
    choixD: string
    reponse: string
    
    constructor (
        id: number,
        id_ville: number,
        question: string,
        choixA: string,
        choixB: string,
        choixC: string,
        choixD: string,
        reponse: string
        ) : Quiz
}