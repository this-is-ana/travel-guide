<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-back-button @click="router.back()"></ion-back-button>
                </ion-buttons>
                <ion-title>Avis publiés par {{ userName }}</ion-title>
                <NavBar />
            </ion-toolbar>
        </ion-header>

        <ion-content>
            <!-- Liste des avis -->
            <div v-for="(item, index) of travelerReviewsList" style="margin: 10px;border-bottom: 1px solid grey;" class="ion-padding-bottom">
                <ion-text><strong>{{ itemNameList[index] }}, {{ itemCityNameList[index] }}</strong></ion-text>
                <div :class="'rating-'+index" style="padding-bottom: 5px; padding-top: 10px;">
                    <ion-text :style="item.evaluation > 0 ? {'color': 'gold'} : {'color': 'grey'}">&#9733;</ion-text>
                    <ion-text :style="item.evaluation > 1 ? {'color': 'gold'} : {'color': 'grey'} ">&#9733;</ion-text>
                    <ion-text :style="item.evaluation > 2 ? {'color': 'gold'} : {'color': 'grey'} ">&#9733;</ion-text>
                    <ion-text :style="item.evaluation > 3 ? {'color': 'gold'} : {'color': 'grey'} ">&#9733;</ion-text>
                    <ion-text :style="item.evaluation > 4 ? {'color': 'gold'} : {'color': 'grey'} ">&#9733;&emsp;</ion-text>
                    <ion-text>{{ dateFormattedList[index] }}&emsp;&emsp;</ion-text>
                </div><br>
                <ion-text><strong>{{ item.titre }}</strong></ion-text><br><br>
                <ion-text>{{ item.contenu }}</ion-text>
            </div>

        </ion-content>

    </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonContent, IonText, IonTitle } from '@ionic/vue'
import NavBar from "@/components/NavBar.vue"
import { loadReviewsByUser, auth, getUser, db, COLLECTION_REVIEWS, getItemNameAndCityId, getCityName } from '@/services/firebase-service'
import { ref } from 'vue';
import router from '@/router/index';
import { Review } from '@/Review';
import { onSnapshot, collection } from "firebase/firestore";

let user = auth.currentUser;
let travelerReviewsList = ref(<Review[]>([]))
let dateFormattedList = ref<string[]>([])
let itemNameList = ref<string[]>([])
let itemCityNameList = ref<string[]>([])
let userName = ref("")

// Écouteur de l'authentification Firebase
auth.onAuthStateChanged(async currentUser => {
    if (currentUser) {
        user = currentUser
        let loggedUser = await getUser(user)
        userName.value = loggedUser?.identifiant
    }
    else {
        router.push('/login');
    }
})

// Écouteur de la collection avis de la bd
onSnapshot(collection(db, COLLECTION_REVIEWS), async() => {
    if (user) {
        travelerReviewsList.value = []
        dateFormattedList.value = []
        itemNameList.value = []
        itemCityNameList.value = []

        await getData()
    }
})

async function getData() {
    let userReviewsList = await loadReviewsByUser(user!.uid)

    userReviewsList.forEach(async (review) => {
        let itemData = await getItemNameAndCityId(review.collection, review.id_doc_item)
        let cityName = await getCityName(itemData?.cityId)
        itemNameList.value.push(itemData!.nom)
        itemCityNameList.value.push(cityName)
        dateFormattedList.value.push(review.date.substring(0, 10))
        travelerReviewsList.value.push(review)
    })
}
</script>