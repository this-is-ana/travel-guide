import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { getFirestore, collection, query, where, getDocs, setDoc, doc, getDoc, addDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { City } from "../City";
import { getDownloadURL, getStorage, ref } from "firebase/storage"
import { reactive } from "vue";
import { Restaurant } from "@/Restaurant";
import { Lodging } from "@/Lodging";
import { Place } from "@/Place";
import { Quiz } from "@/Quiz";
import { Review, reviewConverter } from "@/Review"

//Configuration Firebase
const firebaseConfig = {
    apiKey: "AIzaSyD4rB4vChOeao1eXSXCTUkG58rvSX6-_e8",
    authDomain: "villesdumonde-905b8.firebaseapp.com",
    projectId: "villesdumonde-905b8",
    storageBucket: "villesdumonde-905b8.appspot.com",
    messagingSenderId: "642670933838",
    appId: "1:642670933838:web:bd3c7ff62c701b8569101f"
};

//Initialisation du service Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app)

// Constantes liées à la base de données
const COLLECTION_USERS = collection(db, 'utilisateurs');
const COLLECTION_WISHLISTS = collection(db, 'favoris');
const COLLECTION_REQUESTS = collection(db, 'requetes');
const COLLECTION_CITIES = "villes"
const COLLECTION_RESTAURANTS = "restaurants"
const COLLECTION_PLACES = "lieux"
const COLLECTION_LODGING = "hebergements"
const COLLECTION_QUIZ = "quiz"
const COLLECTION_AGENCIES = "agences"
const COLLECTION_REVIEWS = "avis"

// Pour assurer la réactivité des variables
const state = reactive({
    citiesList: <City[]>[], // Tableau d'objets City
    restaurantsList: <Restaurant[]>[], // Tableau d'objets Restaurant
    placesList: <Place[]>[], // Tableau d'objets Place
    lodgingList: <Lodging[]>[], // Tableau d'objets Lodging
    questionsList: <Quiz[]>[], // Tableau d'objets Quiz
    idDocAgencyList: <string[]>[], // Tableau des id des documents de la collection utilisateurs dont le type est une agence de voyage
    reviewsList: <Review[]>[], // Tableau d'objets Review
    agencyLine: <HTMLElement>(document.createElement('div')), // Élement hmtl où s'affiche le logo de l'agence
    agencyLogoPath: "", // Chemin dans le storage où se trouve le fichier du logo de l'agence
    agencyUrl: "", // Adresse du site web de l'agence
    reviewsCountList: <number[]>[], // Tableau qui contient le nombre d'avis pour chaque item(restaurant, hôtel, lieu)
    addQuizMessage: "", // Messages pour le toast pour l'ajout d'une question au quiz
    itemDocIdList: <string[]>[], // Tableau des id doc des items 
    docIdList: <string[]>[], // Tableau des id doc des items au chargement d'une vue, selon le type d'item et la ville
    docIdReview: <string[]>[], // Tableau des id doc des avis pour une collection donnée
    userName: "", // Variable pour obtenir l'identifiant de la collection utilisateurs servant à afficher les avis
    addReviewMessage: "", // Messages pour le toast pour l'ajout d'un avis
    reviewDocIdForItem: <string[]>[], // Tableau des id doc des avis pour un item donné
    cities: <City[]>[] // Tableau de tous les objets City (sans prendre en compte la visibilité)
})

async function login(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password).catch((e) => {
        alert('Courriel et/ou mot de passe invalide')
    })
}

function logout() {
    auth.signOut()
}

async function createUser(email: string, password: string, username: string) {
    createUserWithEmailAndPassword(auth, email, password).then(cred => {
        setDoc(doc(COLLECTION_USERS, cred.user.uid), {
            courriel: email,
            identifiant: username,
            typeUtilisateur: 'Voyageur'
        })
    })
}

async function getUser(authUser: any) {
    const docSnap = await getDoc(doc(COLLECTION_USERS, authUser.uid))
    let userData = null;

    if (docSnap.exists()) {
        userData = docSnap.data()
    }

    return userData;
}

// Fonction pour récupérer les informations d'un utilisateur dans la bd
async function getUserInfo(docId: string) {
    const docSnap = await getDoc(doc(COLLECTION_USERS, docId))

    if (docSnap.exists()) {
        state.userName = docSnap.data().identifiant
    }
}

async function getUserByEmail(email: string) {
    const q = query(COLLECTION_USERS, where("courriel", "==", email));
    const querySnapshot = await getDocs(q);
    let user = null

    querySnapshot.forEach((doc) => {
        user = doc.data()
    })
    return user;
}

async function getByUsername(username: string) {
    const q = query(COLLECTION_USERS, where("identifiant", "==", username));
    const querySnapshot = await getDocs(q);
    let user = null

    querySnapshot.forEach((doc) => {
        user = doc.data()
    })
    return user;
}

function updateUser(email: string, username: string, password: string, oldEmail: string, oldPassword: string, userType: string) {
    let currentUser = auth.currentUser;
    let cred = EmailAuthProvider.credential(oldEmail, oldPassword)

    reauthenticateWithCredential(currentUser!, cred!).then(() => {
        updatePassword(currentUser!, password)

        updateDoc(doc(COLLECTION_USERS, auth.currentUser?.uid), {
            courriel: email,
            identifiant: username,
            typeUtilisateur: userType
        }).then(() => {
            alert('Succès. Compte modifié')
        })
    }).catch((e) => {
        alert('Ancien mot de passe invalide')
    })
}

async function showWishList(uid: string) {
    let wishList: any[] = [];
    const querySnap = await getDocs(query(COLLECTION_WISHLISTS, where("identifiant", "==", uid)));

    querySnap.forEach((doc) => {
        if(doc.data().estFavori == true){
            wishList.push(doc.data())
        }
    })

    return wishList;
}

async function getwishListIdByUserIdAndDocId(userId: string, docId: any, collectionName: string) {
    const q = query(COLLECTION_WISHLISTS, where("identifiant", "==", userId), where("idDocItem", "==", docId), where("collection", "==", collectionName));
    const querySnapshot = await getDocs(q);
    let id = null;

    querySnapshot.forEach((doc) => {
        id = doc.id;
    })

    return id;
}

async function getDocumentById(collectionName: string, docId: any) {
    const q = query(collection(db, collectionName), where("id", "==", docId))
    const querySnapshot = await getDocs(q);
    let docData = null;

    querySnapshot.forEach((doc) => {
        docData = doc.data()
    })

    return docData;
}

async function addDocumentToWishList(collectionName: string, docId: any, userId: string) {
    let existingId = await getwishListIdByUserIdAndDocId(userId, docId, collectionName)

    if (existingId != null) {
        updateDoc(doc(db, 'favoris', existingId), {
            collection: collectionName,
            estFavori: true,
            idDocItem: docId,
            identifiant: userId
        })
    } else if (existingId == null) {
        addDoc(collection(db, 'favoris'), {
            collection: collectionName,
            estFavori: true,
            idDocItem: docId,
            identifiant: userId
        })
    }
}

async function removeDocFromWishList(collectionName: string, docId: any, userId: string) {
    let id = await getwishListIdByUserIdAndDocId(userId, docId, collectionName)

    if (id != null) {
        updateDoc(doc(db, 'favoris', id), {
            collection: collectionName,
            estFavori: false,
            idDocItem: docId,
            identifiant: userId
        })
    }
}

async function addCity(airportCode: string, description: string, latitude: number, longitude: number, name: string, country: string, visibility: boolean, homeImage: string, imageDetails: string) {
    let newId = await createNewItemId('villes')
    
    addDoc(collection(db, 'villes'), {
        codeAeroport: airportCode,
        description: description,
        id: newId,
        imageAccueil: homeImage,
        imageDetails: imageDetails,
        latitude: latitude,
        longitude: longitude,
        nom: name,
        pays: country,
        visibilite: visibility
    })
}

async function getDocumentIdById(collectionName: string, docId: any) {
    const q = query(collection(db, collectionName), where("id", "==", docId))
    const querySnapshot = await getDocs(q);
    let docDataId = null;

    querySnapshot.forEach((doc) => {
        docDataId = doc.id
    })

    return docDataId;
}

async function setResto(budget: string, contact: string, cote: string, description: string, id: number, idCreateur: string, idVille: number, imageResto: string, nom: string, siteWeb: string, specialite: string, visibilite: boolean) {
    if(id != 0) {
        let docId = await getDocumentIdById('restaurants', id)

        if(docId != null) {
            updateDoc(doc(db, 'restaurants', docId), {
                budget: budget,
                contact: contact,
                cote: cote,
                description: description,
                id: id,
                id_createur: idCreateur,
                id_ville: idVille,
                imageResto: imageResto,
                nom: nom,
                siteWeb: siteWeb,
                specialite: specialite,
                visibilite: visibilite
            })
        }
    } else {
        let newId = await createNewItemId('restaurants')

        addDoc(collection(db, 'restaurants'), {
            budget: budget,
            contact: contact,
            cote: cote,
            description: description,
            id: newId,
            id_createur: idCreateur,
            id_ville: idVille,
            imageResto: imageResto,
            nom: nom,
            siteWeb: siteWeb,
            specialite: specialite,
            visibilite: visibilite
        })
    }
}

async function deleteResto(id: number) {
    let docId = await getDocumentIdById('restaurants', id)

    if(docId != null) {
        deleteDoc(doc(db, 'restaurants', docId))
    }
}

async function setPlace(description: string, id: number, idCreateur: string, idVille: number, imageLieu: string, latitude: number, longitude: number, nom: string, visibilite: boolean) {
    if(id != 0) {
        let docId = await getDocumentIdById('lieux', id)

        if(docId != null) {
            updateDoc(doc(db, 'lieux', docId), {
                description: description,
                id: id,
                id_createur: idCreateur,
                id_ville: idVille,
                imageLieu: imageLieu,
                latitude: latitude,
                longitude: longitude,
                nom: nom,
                visibilite: visibilite
            })
        }
    } else {
        let newId = await createNewItemId('lieux')
        
        addDoc(collection(db, 'lieux'), {
            description: description,
            id: newId,
            id_createur: idCreateur,
            id_ville: idVille,
            imageLieu: imageLieu,
            latitude: latitude,
            longitude: longitude,
            nom: nom,
            visibilite: visibilite
        })
    }
}

async function deletePlace(id: number) {
    let docId = await getDocumentIdById('lieux', id)

    if(docId != null) {
        deleteDoc(doc(db, 'lieux', docId))
    }
}

async function setLodging(categorie: string, cote: string, description: string, id: number, idCreateur: string, idVille: number, imageHebergement: string, latitude: number, longitude: number, nom: string, siteWeb: string, visibilite: boolean) {
    if(id != 0) {
        let docId = await getDocumentIdById('hebergements', id)

        if(docId != null) {
            updateDoc(doc(db, 'hebergements', docId), {
                categorie: categorie,
                cote: cote,
                description: description,
                id: id,
                id_createur: idCreateur,
                id_ville: idVille,
                imageHebergement: imageHebergement,
                latitude: latitude,
                longitude: longitude,
                nom: nom,
                siteWeb: siteWeb,
                visibilite: visibilite
            })
        }
    } else {
        let newId = await createNewItemId('hebergements')
        
        addDoc(collection(db, 'hebergements'), {
            categorie: categorie,
            cote: cote,
            description: description,
            id: newId,
            id_createur: idCreateur,
            id_ville: idVille,
            imageHebergement: imageHebergement,
            latitude: latitude,
            longitude: longitude,
            nom: nom,
            siteWeb: siteWeb,
            visibilite: visibilite
        })
    }
}

async function deleteLodging(id: number) {
    let docId = await getDocumentIdById('hebergements', id)

    if(docId != null) {
        deleteDoc(doc(db, 'hebergements', docId))
    }
}

async function getRequests() {
    let requests: any[] = [];
    const querySnapshot = await getDocs(COLLECTION_REQUESTS);

    querySnapshot.forEach((doc) => {
        requests.push(doc.data())
    })

    return requests;
}

async function getDocumentByDocId(collectionName: string, docId: string) {
    const docSnap = await getDoc(doc(db, collectionName, docId))

    return docSnap.data()
}

async function getDocumentIdByIdDocItem(collectionName: string, docId: string) {
    const q = query(collection(db, collectionName), where("id_doc_item", "==", docId))
    const querySnapshot = await getDocs(q);
    let docDataId = null;

    querySnapshot.forEach((doc) => {
        docDataId = doc.id
    })

    return docDataId;
}

async function setRequest(collectionName: string, id: number, response: string, typeRequete: string) {
    let docId = await getDocumentIdById(collectionName, id)
    let reqId = await getDocumentIdByIdDocItem('requetes', docId!)
    
    if(typeRequete == 'Ajouter') {
        if(response == 'Accepté') {
            await updateDoc(doc(db, collectionName, docId!), {
                visibilite: true
            })
        }
    } else if(typeRequete == 'Supprimer') {
        if(response == 'Accepté') {
            await updateDoc(doc(db, collectionName, docId!), {
                visibilite: false
            })
        }
    }

    await updateDoc(doc(db, 'requetes', reqId!), {
        dateTimeResponse: new Date().toLocaleString(),
        statutRequete: response
    })
}

//Requête pour récupérer tous les documents de la collection "villes"
async function loadCity() {
    state.citiesList = [];
    state.cities = [];
    const querySnap = await getDocs(query(collection(db, COLLECTION_CITIES)));

    //Ajout de chaque document dans le tableau "villes" + téléchargement des images
    querySnap.forEach((doc) => {
        state.cities.push(doc.data() as City)

        if(doc.data().visibilite == true){
            state.citiesList.push(doc.data() as City);
            getImage(doc.data().imageAccueil, 'city'+doc.data().id)
        }
    })
}

// Fonction qui permet d'obtenir le nom de l'item et l'id de la ville de l'item pour l'affichage des avis d'un client voyageur
async function getItemNameAndCityId(collectionName: string, itemIdDoc: string) {
    let cityInfoList = null

    const docSnap = await getDoc(doc(db, collectionName, itemIdDoc))

    if (docSnap.exists()) {
        cityInfoList = {nom: docSnap.data().nom, cityId: docSnap.data().id_ville}
    }
    return cityInfoList
}

// Fonction qui permet d'obtenir le nom de la ville à partir de son id
async function getCityName(cityId: number) {
    let cityName = ""

    const queryCityName = query(collection(db, COLLECTION_CITIES), where ('id', '==', cityId))
    const querySnap = await getDocs(queryCityName)

    cityName = querySnap.docs[0].data().nom

    return cityName
}

// Fonction qui charge les restaurants de la bd en recevant l'id de la ville en paramètre; elle obtient aussi l'image du restaurant
async function loadRestaurants(id_city: number) {
    state.restaurantsList = []
    state.docIdList = []

    const queryRestautantsList = query(collection(db, COLLECTION_RESTAURANTS), where('id_ville', '==', id_city), where('visibilite', '==', true))
    const querySnap = await getDocs(queryRestautantsList)

    querySnap.forEach((doc) => {
        state.restaurantsList.push(doc.data() as Restaurant)
        getImage(doc.data().imageResto, 'restaurant'+doc.data().id)
        state.docIdList.push(doc.id)
    })
}

// Fonction qui charge les lieux de la bd en recevant l'id de la ville en paramètre; elle obtient aussi l'image du lieu
async function loadPlaces(id_city: number) {
    state.placesList = []
    state.docIdList = []

    const queryPlacesList = query(collection(db, COLLECTION_PLACES), where('id_ville', '==', id_city), where('visibilite', '==', true))
    const querySnap = await getDocs(queryPlacesList)

    querySnap.forEach((doc) => {
        state.placesList.push(doc.data() as Place)
        getImage(doc.data().imageLieu, 'place'+doc.data().id)
        state.docIdList.push(doc.id)
    })
}

// Fonction qui charge les hôtels de la bd en recevant l'id de la ville en paramètre; elle obtient aussi l'image de l'hôtel
async function loadLodging(id_city: number) {
    state.lodgingList = []
    state.docIdList = []

    const queryLodgingList = query(collection(db, COLLECTION_LODGING), where('id_ville', '==', id_city), where('visibilite', '==', true))
    const querySnap = await getDocs(queryLodgingList)

    querySnap.forEach((doc) => {
        state.lodgingList.push(doc.data() as Lodging)
        getImage(doc.data().imageHebergement, 'lodging'+doc.data().id)
        state.docIdList.push(doc.id)
    })
}

// Fonction qui charge les questions de la bd en recevant l'id de la ville en paramètre pour que l'utlisateur puisse jouer au quiz
async function loadQuiz(id_city: number) {
    state.questionsList = []
    const queryQuizList = query(collection(db, COLLECTION_QUIZ), where('id_ville', '==', id_city))
    const querySnap = await getDocs(queryQuizList)

    querySnap.forEach((doc) => {
        state.questionsList.push(doc.data() as Quiz)
    })
}

// Fonction qui charge les avis de la bd en recevant le nom de la collection en paramètre
async function loadReviews(collectionName: string) {
    state.reviewsList = []
    state.docIdReview = []
    const queryReviewsList = query(collection(db, COLLECTION_REVIEWS).withConverter(reviewConverter), where('collection', '==', collectionName), where('visibilite', '==', true))
    const querySnap = await getDocs(queryReviewsList)

    querySnap.forEach((doc) => {
        state.reviewsList.push(doc.data())
        state.docIdReview.push(doc.id)
    })
}

// Fonction qui charge les avis de la bd pour un item donné
async function loadReviewsForAnItem(itemDocId: string) {
    let itemReviewsList: Review[] = []
    state.reviewDocIdForItem = []

    const queryItemReviewsList = query(collection(db, COLLECTION_REVIEWS).withConverter(reviewConverter), where('id_doc_item', '==', itemDocId), where('visibilite', '==', true))
    const querySnap = await getDocs(queryItemReviewsList)

    if (!querySnap.empty) {
        querySnap.forEach((doc) => {
            itemReviewsList.push(doc.data())
            state.reviewDocIdForItem.push(doc.id)
        })
    }
    return itemReviewsList
}

// Fonction qui charge les avis d'un utilisateur
async function loadReviewsByUser(userId: string) {
    let userReviewsList: Review[] = []

    const queryUserReviewsList = query(collection(db, COLLECTION_REVIEWS).withConverter(reviewConverter), where('id_utilisateur', '==', userId), where('visibilite', '==', true))
    const querySnap = await getDocs(queryUserReviewsList)

    if (!querySnap.empty) {
        querySnap.forEach((doc) => {
            userReviewsList.push(doc.data())
        })
    }
    return userReviewsList
}

// Fonction qui charge les id des documents pour une collection et une ville données
async function loadItemDocId(collectionName: string, cityId: number) {
    state.itemDocIdList = []

    const queryItemDocIdList = query(collection(db, collectionName), where('id_ville', '==', cityId))
    const querySnap = await getDocs(queryItemDocIdList)

    querySnap.forEach((doc) => {
        state.itemDocIdList.push(doc.id)
    })
}

// Fonction qui charge les id des documents de la collection utilisateurs qui ont comme type d'utilisateur une agence
async function loadIdDocAgency() {
    state.idDocAgencyList = []
    const queryIdDocAgencyList = query(COLLECTION_USERS, where('typeUtilisateur', '==', 'Agence'))
    const querySnap = await getDocs(queryIdDocAgencyList)

    querySnap.forEach((doc) => {
        state.idDocAgencyList.push(doc.id)
    })
}

// Fonction qui charge le chemin d'accès au logo de l'agence dans le storage de Firebase ainsi que l'adresse du site web de l'agence
async function loadAgencyLogoPathAndUrl(creatorId: string, logoId: string, webSite: string) {
    let image = document.getElementById(logoId)
    let tagWebLink = document.getElementById(webSite)

    const queryAgencyLogoPath = query(collection(db, COLLECTION_AGENCIES), where('id_Utilisateur', '==', creatorId))
    const querySnap = await getDocs(queryAgencyLogoPath)
    state.agencyLogoPath = querySnap.docs[0].data().logoImg
    state.agencyUrl = querySnap.docs[0].data().lienWeb

    let url = await getDownloadURL(ref(storage, state.agencyLogoPath))
    image!.setAttribute('src', url)
    tagWebLink!.setAttribute('href', state.agencyUrl)
}

// Fonction qui charge l'image de chaque item(restaurant, lieu, hébergement) du storage de Firebase
function getImage(imagePath: string, elementId: string) {
    
    getDownloadURL(ref(storage, imagePath))
        .then((url) => {
            let image = document.getElementById(elementId)
            image?.setAttribute('src', url)
        })
}

// Fonction pour obtenir l'adresse url d'une image dans le storage de Firestore
async function getImageUrl(imagePath: string) {
    let url = await getDownloadURL(ref(storage, imagePath))
    return url
}

// Fonction qui stocke dans un tableau le nombre d'avis pour un item donné après avoir chargé la collection avis de la bd
async function getReviewsCount(collectionName: string, cityId: number) {
    state.reviewsCountList = []
    await loadReviews(collectionName)
    await loadItemDocId(collectionName, cityId)
    let reviewsCounter = 0
    
    for (let docId of state.docIdList) {   
        for (let review of state.reviewsList) {
            if (docId == review.id_doc_item) {
                reviewsCounter++
            }
        }
        state.reviewsCountList.push(reviewsCounter)
        reviewsCounter = 0
    }
}

// Fonction qui ajoute la nouvelle question à la collection quiz de la bd
async function addQuestionInQuiz(cityId: number, question: string, choixA: string, choixB: string, choixC: string, choixD: string, reponse: string) {
    let newQuestionId = await createNewItemId(COLLECTION_QUIZ)
    let newQuestion = { id: newQuestionId, id_ville: cityId, question: question, choixA: choixA, choixB: choixB, choixC: choixC, choixD: choixD, reponse: reponse } as Quiz
    
    try {
        await addDoc(collection(db, COLLECTION_QUIZ), newQuestion)
        state.addQuizMessage = "La question a été ajoutée avec succès à la base de données."
    } catch(e) {
        state.addQuizMessage = "La question n'a pas pu être ajoutée à la base de données."
    }
}

// Fonction qui ajoute un avis à la collection avis de la bd
async function addReview(userId: string, itemDocId: string, rating: number, title: string, collectionName: string, content: string) {
    let reviewDate = String(new Date().toJSON())
    let newReview = new Review (userId, itemDocId, rating, title, collectionName, content, reviewDate, true)

    try {
        await addDoc(collection(db, COLLECTION_REVIEWS).withConverter(reviewConverter), newReview)
        state.addReviewMessage = "Avis ajouté avec succès!"
    } catch(e) {
        state.addReviewMessage = "L'avis n'a pas pu être ajouté."
    }
}

// Fonction qui met la visibilité d'un avis à false dans la collection avis de la bd
async function deleteReview(reviewDocId: string) {
    const deletedReview = await updateDoc(doc(db, COLLECTION_REVIEWS, reviewDocId), {
        visibilite: false
    })
    state.addReviewMessage = "Avis supprimé."
}

// Fonction qui génère un id unique lors de l'ajout d'un item(restaurant, lieu, hébergement, quiz, ville) à la bd; elle reçoit en paramètre le nom de la collection
async function createNewItemId(collectionName: string): Promise<number> {
    let itemsList: any[] = []

    const queryItemsList = query(collection(db, collectionName))
    const querySnap = await getDocs(queryItemsList)

    querySnap.forEach((doc) => {
        itemsList.push(doc.data())
    })

    let maxIdValue = Math.max.apply(null, itemsList.map(function (list) { return list.id }))

    return maxIdValue + 1
}

export { db, storage, loadCity, getImage, getByUsername, getUserByEmail, createUser, loadLodging, loadPlaces, loadQuiz, loadRestaurants, state, COLLECTION_CITIES, COLLECTION_LODGING, COLLECTION_PLACES, COLLECTION_QUIZ, COLLECTION_RESTAURANTS, logout, login, getUser, auth, updateUser, addQuestionInQuiz, COLLECTION_REVIEWS, getReviewsCount, getUserInfo, addReview, deleteReview, getDocumentById, addDocumentToWishList, removeDocFromWishList, COLLECTION_WISHLISTS, addCity, setResto, deleteResto, deletePlace, setPlace, deleteLodging, setLodging, showWishList, loadAgencyLogoPathAndUrl, loadIdDocAgency, loadReviews, loadReviewsForAnItem, COLLECTION_REQUESTS, getRequests, getDocumentByDocId, setRequest, getImageUrl, loadReviewsByUser, getItemNameAndCityId, getCityName };
