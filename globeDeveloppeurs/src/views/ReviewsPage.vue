<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-back-button @click="router.back()"></ion-back-button>
                </ion-buttons>
                <ion-title style="font-size: 15px;">{{ nomItem }}</ion-title>
                <NavBar />
            </ion-toolbar>
        </ion-header>

        <ion-content>
            <!-- Affichage de la moyenne des évaluations, du nombre d'avis et de l'icône d'ajout d'un avis -->
            <ion-item lines="none" class="average-rating" style="padding-bottom: 5px;">
                <ion-grid>
                    <ion-row class="ion-justify-content-center">
                        <ion-text class="rating" :style="averageRating > 0 ? {'color': 'gold'} : {'color': 'grey'}">&#9733;</ion-text>
                        <ion-text class="rating" :style="averageRating > 1 ? {'color': 'gold'} : {'color': 'grey'}">&#9733;</ion-text>
                        <ion-text class="rating" :style="averageRating > 2 ? {'color': 'gold'} : {'color': 'grey'}">&#9733;</ion-text>
                        <ion-text class="rating" :style="averageRating > 3 ? {'color': 'gold'} : {'color': 'grey'}">&#9733;</ion-text>
                        <ion-text class="rating" :style="averageRating > 4 ? {'color': 'gold'} : {'color': 'grey'}">&#9733;&emsp;</ion-text>
                        <ion-text style="margin-top: 6px;"> {{ reviewsList.length }} avis&emsp;&emsp;&emsp;</ion-text>
                    </ion-row>
                    <ion-row class="ion-justify-content-end">
                        <ion-button v-if="userType=='Voyageur'" id="write-icon" fill="clear" @click="setOpenWriteReview(true)">
                            <div style="align-items: center; justify-content: center;">
                                <ion-icon :icon="createOutline" size="large"></ion-icon><br>
                                <p style="font-size: 10px;">Rédiger <br>un avis</p>
                            </div>
                        </ion-button>
                </ion-row>
                </ion-grid>
            </ion-item>
            
            <!-- Liste des avis -->
            <ion-row v-for="(item, index) of reviewsList" style="border-bottom: 1px solid grey;"
                class="ion-padding-vertical">
                <ion-col>
                    <ion-row class="ion-align-items-start">
                        <ion-col>
                            <ion-text><strong>{{ userNameList[index] }}</strong></ion-text>
                            <ion-row :class="'rating-' + index" style="padding-bottom: 5px;">
                                <ion-text :style="item.evaluation > 0 ? { 'color': 'gold' } : { 'color': 'grey' }">&#9733;</ion-text>
                                <ion-text :style="item.evaluation > 1 ? { 'color': 'gold' } : { 'color': 'grey' }">&#9733;</ion-text>
                                <ion-text :style="item.evaluation > 2 ? { 'color': 'gold' } : { 'color': 'grey' }">&#9733;</ion-text>
                                <ion-text :style="item.evaluation > 3 ? { 'color': 'gold' } : { 'color': 'grey' }">&#9733;</ion-text>
                                <ion-text :style="item.evaluation > 4 ? { 'color': 'gold' } : { 'color': 'grey' }">&#9733;&emsp;</ion-text>
                                <ion-text>{{ dateFormattedList[index] }}&emsp;&emsp;</ion-text>
                            </ion-row>
                        </ion-col>
                        <ion-col size="auto">
                            <ion-button fill="clear" v-if="userType == 'Admin'"
                                @click="presentAlert(reviewDocIdList[index])">
                                <ion-icon :icon="trashOutline"></ion-icon>
                            </ion-button>
                        </ion-col>
                    </ion-row>
                    <ion-row class="ion-margin-vertical">
                        <ion-text><strong>{{ item.titre }}</strong></ion-text>
                    </ion-row>
                    <ion-row class="ion-padding-bottom">
                        <ion-text>{{ item.contenu }}</ion-text>
                    </ion-row>
                </ion-col>
            </ion-row>
            
            
            <!-- Modal pour rédiger un avis -->
            <ion-modal :is-open="isOpenWriteReview" @didDismiss="setOpenWriteReview(false)" class="ion-padding">
                <ion-header>
                    <ion-toolbar>
                        <ion-title style="font-size: medium; overflow: hidden;">Rédiger un avis sur {{ nomItem }}</ion-title>
                        <ion-buttons slot="end">
                            <ion-button fill="clear" @click="setOpenWriteReview(false)">
                                <ion-icon :icon="close" color="primary"></ion-icon>
                            </ion-button>
                        </ion-buttons>
                    </ion-toolbar>
                </ion-header>
                <ion-content>
                    <ion-row class="ion-padding">
                        <div class="modal-ratings">
                            <a @click="getNewReviewRating(5)">&#9733;</a>
                            <a @click="getNewReviewRating(4)">&#9733;</a>
                            <a @click="getNewReviewRating(3)">&#9733;</a>
                            <a @click="getNewReviewRating(2)">&#9733;</a>
                            <a @click="getNewReviewRating(1)">&#9733;</a>
                        </div>
                    </ion-row>
                    <ion-item class="ion-marging-bottom">
                        <ion-input v-model="title" clear-input required label="Donnez un titre à votre avis" label-placement="floating" fill="solid"></ion-input>
                    </ion-item>
                    <ion-item class="ion-padding-bottom">
                        <ion-textarea v-model="content" :clear-on-edit="true" required label="Écrivez votre avis" label-placement="floating" :autoGrow="true" fill="solid" style="min-height: 100px;"></ion-textarea>
                    </ion-item>
                    <ion-item lines="none">
                        <ion-text style="font-size: smaller;">Tous les champs sont obligatoires</ion-text>
                    </ion-item>
                    <ion-buttons fill="clear" class="ion-justify-content-center ion-padding-top ion-padding-bottom">
                        <ion-button color="secondary" @click="validateReview(user!.uid, docIdItem, rating, title, collectionName, content)">Envoyer</ion-button>
                    </ion-buttons>
                </ion-content>
            </ion-modal>

        </ion-content>

    </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, onIonViewDidEnter, IonItem, IonText, IonRow, IonGrid, IonIcon, IonButton, IonModal, IonInput, IonTextarea, alertController, toastController, IonCol } from '@ionic/vue';
import NavBar from "@/components/NavBar.vue"
import { useRouter, useRoute } from 'vue-router';
import { state, getUserInfo, auth, getUser, COLLECTION_REVIEWS, db, addReview, deleteReview, loadReviewsForAnItem } from '@/services/firebase-service';
import { ref } from 'vue';
import { trashOutline, createOutline, close } from 'ionicons/icons';
import { onSnapshot, collection } from "firebase/firestore";
import { Review } from '@/Review';

const router = useRouter()
const route = useRoute()
let nomItem = route.params.name
let docIdItem = String(route.params.idDoc)
let collectionName = String(route.params.collectionName)
let reviewsList = ref<Review[]>([])
let reviewDocIdList =  ref<string[]>([])
let dateFormattedList = ref<string[]>([])
let userNameList = ref<string[]>([])
let averageRating = ref(0)
let user = auth.currentUser
let userType = ref("Guest")
let isOpenWriteReview = ref(false)
let title = ""
let content = ""
let rating = 0

// Écouteur de la collection avis de la bd
onSnapshot(collection(db, COLLECTION_REVIEWS), async() => {
    reviewsList.value = []
    await getItemReviewsData()
    setAverageRating()
})

onIonViewDidEnter(async () =>{
   // Écouteur de l'authentification Firebase
    auth.onAuthStateChanged(async(currentUser) => {
        if (currentUser) {
            user = currentUser
            let loggedUser = await getUser(user)
            userType.value = loggedUser?.typeUtilisateur
        }
        else  {
            userType.value = "Guest"
        }
    })
})

// Fonction qui récupère les avis pour un item donné
async function getItemReviewsData() {
    reviewsList.value = await loadReviewsForAnItem(docIdItem)

    if (reviewsList.value.length > 0) {
        for(let i = 0; i < reviewsList.value.length; i++) {
            dateFormattedList.value.push(reviewsList.value[i].date.substring(0, 10))
            reviewDocIdList.value.push(state.reviewDocIdForItem[i])
            await getUserInfo(reviewsList.value[i].id_utilisateur)
            userNameList.value.push(state.userName)
        }
    }   
}

// Fonction qui calcule la moyenne des avis pour un item donné
function setAverageRating() {
    let totalRatings = 0
    for (let itemReview of reviewsList.value) {
        totalRatings += itemReview.evaluation
    }
    averageRating.value = Math.round(totalRatings/reviewsList.value.length)
}

// Fonction qui récupère la cote attribuée lors de la rédaction d'un avis
function getNewReviewRating(value: number) {
    rating = value
    let newReviewStars = document.querySelectorAll('.modal-ratings a')

    for (let star of newReviewStars) {
            star.setAttribute('style', 'color: grey')
    }

    for (let i =1; i <= value; i++) {
            newReviewStars[newReviewStars.length-i].setAttribute('style', 'color: gold')
    } 
}

// Fonction qui valide que tous les renseignements sont fournis lors de la rédaction d'un avis et l'ajoute à la base de données
async function validateReview(userId: string, docIdItem: string, rating: number, title: string, collectionName: string, content: string) {
    if (rating == 0 || title == "" || content == "") {
        presentToast('Vous devez remplir tous les champs et attribuer une cote.')
    }
    else {
        await addReview(userId, docIdItem, rating, title, collectionName, content)
        presentToast(state.addReviewMessage)
        setOpenWriteReview(false)
    }
}

// Fonction qui contrôle l'ouverture du modal pour l'ajout d'un avis
function setOpenWriteReview(show: boolean) {
    isOpenWriteReview.value = show
}

// Fonction qui contrôle l'affichage d'une fenêtre d'alerte lorsque l'administrateur veut supprimer un avis
const presentAlert = async (reviewDocId: string) => {
    const alert = await alertController.create({
        header: 'Supprimer un avis',
        message: 'Voulez-vous vraiment supprimer cet avis?',
        buttons: [
            {text: 'Non'},
            {text: 'Oui',
            handler: () => {
                deleteAndPresentToastReview(reviewDocId)
            }
        }]
    }) 
    await alert.present()
}

// Fonction qui supprime l'avis dans la bd
async function deleteAndPresentToastReview(reviewDocId: string) {
    await deleteReview(reviewDocId)
    presentToast(state.addReviewMessage)
}

// Fonction qui contrôle l'affichage du toast pour communiquer différents messages
const presentToast = async(messageAddReview: string) => {
    const toast = await toastController.create({
        message: messageAddReview,
        duration: 3000
    })
    await toast.present()
}
</script>

<style scoped>
 .modal-ratings {
    justify-content: start;
    display: flex;
    flex-direction:row-reverse;        
}
    
.modal-ratings a {
    cursor: pointer;
    color: grey;
    font-size: 30px;
    transition: color .2s, transform .2s;
}

.modal-ratings a:hover {
    color: gold;
    transform: scale (1.3)
}

.modal-ratings a:hover ~a {
    color: gold;
}
</style>