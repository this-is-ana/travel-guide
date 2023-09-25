<template>
    <ion-button fill="clear" expand="block" @click="setOpenAddCity(true)">Ville</ion-button>
    <ion-modal :is-open="isOpenCity" @didDismiss="reset()">
        <ion-header>
            <ion-toolbar>
                <ion-title class="ion-text-center">Ajouter une ville</ion-title>
                <ion-buttons slot="end">
                    <ion-button fill="clear" @click="setOpenAddCity(false)">
                        <ion-icon :icon="close" color="primary"></ion-icon>
                    </ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <ion-content color="light">
            <ion-item>
                <ion-input clear-input type="text" name="pays" label="Pays" label-placement="floating"
                    v-model="pays"></ion-input>
            </ion-item>
            <ion-item>
                <ion-input clear-input type="text" name="city" label="Ville" label-placement="floating"
                    v-model="ville"></ion-input>
            </ion-item>
            <ion-item>
                <label>Image d'accueil &emsp;</label>
                <input type="file" label-placement="floating" @change="getHomeImage($event)">
            </ion-item>
            <ion-item>
                <label>Image de détails&emsp;</label>
                <input type="file" label-placement="floating" @change="getDetailsImage($event)">
            </ion-item>
            <ion-item>
                <ion-input clear-input type="text" name="description" label="Description" label-placement="floating"
                    v-model="description"></ion-input>
            </ion-item>
            <ion-item>
                <ion-input clear-input type="text" name="airportCode" label="Code aéroport" label-placement="floating"
                    v-model="codeAero"></ion-input>
            </ion-item>
            <ion-item>
                <ion-input clear-input type="number" label="Latitude" label-placement="floating"
                    v-model="latitude"></ion-input>
            </ion-item>
            <ion-item>
                <ion-input clear-input type="number" label="Longitude" label-placement="floating"
                    v-model="longitude"></ion-input>
            </ion-item>
            <ion-item>
                <ion-toggle justify="start" class="ion-margin-end" v-model="visibilite">Visibilité</ion-toggle>
            </ion-item><br>
            <ion-text class="ion-padding-start">Tous les champs sont obligatoires</ion-text><br>
            <ion-buttons class="ion-justify-content-center ion-padding-top ion-padding-bottom">
                <ion-button fill="clear" color="primary" @click="setCity">Ajouter</ion-button>
            </ion-buttons>
        </ion-content>
    </ion-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { uploadBytes, ref as refS } from 'firebase/storage';
import { storage, addCity } from '@/services/firebase-service';
import { IonContent, IonItem, IonIcon, IonTitle, IonButtons, IonButton, IonText, IonModal, IonInput, toastController, IonToggle, IonHeader, IonToolbar } from '@ionic/vue';
import { close } from 'ionicons/icons'

let isOpenCity = ref(false);
let pays = ref("")
let ville = ref("")
let description = ref("")
let codeAero = ref("")
let latitude = ref()
let longitude = ref()
let visibilite = ref(false)
let imageAccueil: any
let imageDetails: any

//Gestion de l'ouverture de la modale ajouter une ville
function setOpenAddCity(state: boolean) {
    isOpenCity.value = state
}

async function setCity() {
    if (pays.value == "" || ville.value == "" || description.value == "" || codeAero.value == "" || latitude.value.NAN || longitude.value.NAN || imageAccueil == undefined || imageDetails == undefined) {
        const toast = await toastController.create({
            message: "Merci de remplir tous les champs!",
            duration: 3000
        })
        await toast.present()
    } else {
        //Fonction pour ajouter la ville dans firebase
        const imageAccueilPath = `${ville.value.toLowerCase().replaceAll(' ', '_').normalize('NFD').replaceAll(/[\u0300-\u036f]/g, "")}/${imageAccueil.name}`
        const imageDetailsPath = `${ville.value.toLowerCase().replaceAll(' ', '_').normalize('NFD').replaceAll(/[\u0300-\u036f]/g, "")}/${imageDetails.name}`
        const homeImageRef = refS(storage, imageAccueilPath)
        const detailsImageRef = refS(storage, imageDetailsPath)

        uploadBytes(homeImageRef, imageAccueil)
        uploadBytes(detailsImageRef, imageDetails)

        addCity(codeAero.value.toLocaleLowerCase(), description.value, latitude.value, longitude.value, ville.value, pays.value, visibilite.value, imageAccueilPath, imageDetailsPath)

        setOpenAddCity(false)

        const toast = await toastController.create({
            message: "Ville ajoutée!",
            duration: 3000
        })
        await toast.present()
    }
}

function getHomeImage(ev: any) {
    imageAccueil = ev.target.files[0]
}

function getDetailsImage(ev: any) {
    imageDetails = ev.target.files[0]
}

function reset() {
    setOpenAddCity(false)

    pays = ref("")
    ville = ref("")
    description = ref("")
    codeAero = ref("")
    latitude = ref()
    longitude = ref()
    visibilite = ref(false)
}
</script>