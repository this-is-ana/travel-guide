<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-back-button @click="router.back()"></ion-back-button>
                </ion-buttons>
                <ion-title>Favoris</ion-title>
                <NavBar />
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true" class="ion-padding">
            <ion-text class="ion-text-center">
                <h3>Gastronomie</h3>
            </ion-text>
            <ion-row class="ion-justify-content-center ion-margin-vertical">
                <ion-col>
                    <ion-card v-for="wish of restaurantsWishes" class="ion-padding-bottom ion-margin-bottom">
                        <ion-row class="ion-justify-content-end">
                            <ion-button fill="clear" @click="removeItem('restaurants', wish.id)">
                                <ion-icon :icon="close"></ion-icon>
                            </ion-button>
                        </ion-row>
                        <ion-card-header>
                            <ion-card-title>{{ wish.nom }}</ion-card-title>
                            <ion-card-subtitle><i>{{ wish.id_ville }}</i></ion-card-subtitle>
                        </ion-card-header>
                        <ion-card-content>
                            <p>Spécialité : {{ wish.specialite }}</p>
                            <p>Description : {{ wish.description }}</p>
                            <p>Cote : {{ wish.cote }}</p>
                            <p>Budget : {{ wish.budget }}</p>
                            <a :href="wish.siteWeb">{{ wish.siteWeb }}</a>
                        </ion-card-content>
                    </ion-card>
                </ion-col>
            </ion-row>
            <ion-text class="ion-text-center">
                <h3>Sites à visiter</h3>
            </ion-text>
            <ion-row class="ion-justify-content-center ion-margin-vertical">
                <ion-col>
                    <ion-card v-for="wish of placesWishes" class="ion-padding-bottom ion-margin-bottom">
                        <ion-row class="ion-justify-content-end">
                            <ion-button fill="clear" @click="removeItem('lieux', wish.id)">
                                <ion-icon :icon="close"></ion-icon>
                            </ion-button>
                        </ion-row>
                        <ion-card-header>
                            <ion-card-title>{{ wish.nom }}</ion-card-title>
                            <ion-card-subtitle><i>{{ wish.id_ville }}</i></ion-card-subtitle>
                        </ion-card-header>
                        <ion-card-content>
                            {{ wish.description }}
                        </ion-card-content>
                    </ion-card>
                </ion-col>
            </ion-row>
            <ion-text class="ion-text-center">
                <h3>Hébergements</h3>
            </ion-text>
            <ion-row class="ion-justify-content-center ion-margin-bottom">
                <ion-col>
                    <ion-card v-for="wish of lodgingWishes" class="ion-padding-bottom ion-margin-bottom">
                        <ion-row class="ion-justify-content-end">
                            <ion-button fill="clear" @click="removeItem('hebergements', wish.id)">
                                <ion-icon :icon="close"></ion-icon>
                            </ion-button>
                        </ion-row>
                        <ion-card-header>
                            <ion-card-title>{{ wish.nom }}</ion-card-title>
                            <ion-card-subtitle><i>{{ wish.id_ville }}</i></ion-card-subtitle>
                        </ion-card-header>
                        <ion-card-content>
                            <p>Description : {{ wish.description }}</p>
                            <p>Cote : {{ wish.cote }}</p>
                            <p>Catégorie : {{ wish.categorie }}</p>
                            <a :href="wish.siteWeb">{{ wish.siteWeb }}</a>
                        </ion-card-content>
                    </ion-card>
                </ion-col>
            </ion-row>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonRow, IonCard, IonCardHeader, IonCardContent, IonCardTitle, IonText, IonIcon, IonButton, IonCol, IonCardSubtitle } from '@ionic/vue';
import NavBar from "@/components/NavBar.vue";
import router from '@/router/index';
import { auth, getDocumentById, removeDocFromWishList, COLLECTION_WISHLISTS, showWishList, getCityName } from '@/services/firebase-service'
import { onSnapshot, DocumentData } from "firebase/firestore";
import { close } from 'ionicons/icons';
import { ref } from 'vue';

let restaurantsWishes = ref()
let placesWishes = ref()
let lodgingWishes = ref()
let user = auth.currentUser;

auth.onAuthStateChanged(async currentUser => {
    if (currentUser) {
        user = currentUser
    } else {
        router.push('/login');
    }
})

onSnapshot(COLLECTION_WISHLISTS, async () => {
    if (user) {
        restaurantsWishes.value = []
        placesWishes.value = []
        lodgingWishes.value = []

        let wishList = await showWishList(user.uid)

        for (let wish of wishList) {
            showList(wish)
        }
    }
})

async function showList(docData: DocumentData) {
    let wishData = null;
    wishData = await getDocumentById(docData.collection, docData.idDocItem)
    wishData!.id_ville = await getCityName(wishData!.id_ville)

    if (docData.collection == 'restaurants') {
        restaurantsWishes.value.push(wishData)
    }

    if (docData.collection == 'lieux') {
        placesWishes.value.push(wishData)
    }

    if (docData.collection == 'hebergements') {
        lodgingWishes.value.push(wishData)
    }
}

async function removeItem(collectionName: string, id: string) {
    removeDocFromWishList(collectionName, id, user!.uid)
}
</script>

<style scoped>
a {
    text-decoration: none;
}
</style>