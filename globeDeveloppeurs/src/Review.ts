import { DocumentSnapshot, QueryDocumentSnapshot, QuerySnapshot, SnapshotOptions } from "firebase/firestore"

export class Review {
    id_utilisateur: string
    id_doc_item: string
    evaluation: number
    titre: string
    collection: string
    contenu: string
    date: string
    visibilite: boolean

    constructor(id_utilisateur: string,  id_doc_item: string, evaluation: number, titre: string, collection: string, contenu: string, date: string, visibilite: boolean) {
        this.id_utilisateur = id_utilisateur
        this.id_doc_item = id_doc_item
        this.evaluation = evaluation
        this.titre = titre
        this.collection = collection
        this.contenu = contenu
        this.date = date
        this.visibilite = visibilite
    }
}

export const reviewConverter = {
    toFirestore: (review: Review) => {
        return {
            id_utilisateur: review.id_utilisateur,
            id_doc_item: review.id_doc_item,
            evaluation: review.evaluation,
            titre: review.titre,
            collection: review.collection,
            contenu: review.contenu,
            date: review.date,
            visibilite: review.visibilite
        }
    },
    fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions) => {
        const data = snapshot.data(options)
        return new Review(data.id_utilisateur, data.id_doc_item, data.evaluation, data.titre, data.collection, data.contenu, data.date, data.visibilite)
    }
}