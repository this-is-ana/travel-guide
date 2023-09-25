<template>
    <ion-button fill="clear" @click="setOpenPlace(true)">Lieu</ion-button>
    <ion-modal :is-open="isOpenPlace" @didDismiss="reset()">
        <ion-header>
            <ion-toolbar>
                <ion-title class="ion-text-center">Ajouter un lieu</ion-title>
                <ion-buttons slot="end">
                    <ion-button fill="clear" @click="setOpenPlace(false)">
                        <ion-icon :icon="close" color="primary"></ion-icon>
                    </ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <ion-item>
                <ion-input clear-input type="text" v-model="nom" label="Nom du lieu" label-placement="floating"></ion-input>
            </ion-item>
            <ion-item>
                <ion-select aria-label="Villes" interface="popover" placeholder="Ville" justify="start"
                    v-model="selectedCity">
                    <ion-item v-for="city in state.cities">
                        <ion-select-option :value="city">{{ city.nom }}</ion-select-option>
                    </ion-item>
                </ion-select>
            </ion-item>
            <ion-item id="addNewHotelPic" style="display:inline">
                <label>Ajouter une nouvelle image :&emsp;</label>
                <input type="file" label-placement="floating" @change="getPlaceImage($event)">
            </ion-item>
            <ion-item>
                <ion-input clear-input type="text" v-model="description" label="Description du lieu"
                    label-placement="floating"></ion-input>
            </ion-item>
            <ion-item>
                <ion-input clear-input type="number" v-model="latitude" label="Latitude"
                    label-placement="floating"></ion-input>
            </ion-item>
            <ion-item>
                <ion-input clear-input type="number" v-model="longitude" label="Longitude"
                    label-placement="floating"></ion-input>
            </ion-item>
            <ion-item>
                <ion-toggle justify="start" class="ion-margin-end" v-model="visibilite">Visibilité</ion-toggle>
            </ion-item><br>
            <ion-text class="ion-padding-start">Tous les champs sont obligatoires</ion-text><br>
            <ion-buttons fill="clear" class="ion-justify-content-center ion-padding-vertical">
                <ion-button color="primary" @click="setLieu">Ajouter</ion-button>
            </ion-buttons>
        </ion-content>
    </ion-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { uploadBytes, ref as refS } from 'firebase/storage';
import { auth, storage, setPlace, state, loadCity } from '@/services/firebase-service';
import { IonContent, IonItem, IonIcon, IonTitle, IonButtons, IonButton, IonText, IonModal, IonInput, toastController, IonToggle, onIonViewWillEnter, IonHeader, IonToolbar, IonSelect, IonSelectOption } from '@ionic/vue';
import { close } from 'ionicons/icons'

let isOpenPlace = ref(false)
let nom = ref()
let description = ref()
let latitude = ref()
let longitude = ref()
let visibilite = ref()
let selectedCity = ref()
let idCreateur = auth.currentUser?.uid
let imageLieu: any

onIonViewWillEnter(() => {
    auth.onAuthStateChanged(currentUser => {
        idCreateur = currentUser?.uid
    })

    if (state.cities.length == 0) {
        loadCity()
    }
})

//Gestion de l'ouverture de la modale ajouter un Lieu
function setOpenPlace(state: boolean) {
    isOpenPlace.value = state
}

async function setLieu() {
    //New place
    if (description.value == '' || description.value == undefined || nom.value == '' || nom.value == undefined || latitude.value == '' || latitude.value == undefined || longitude.value == '' || longitude.value == undefined || imageLieu == undefined || selectedCity.value == undefined) {
        const toast = await toastController.create({
            message: "Merci de remplir tous les champs!",
            duration: 3000
        })
        await toast.present()
    } else {
        let cityName = selectedCity.value.nom
        let cityId = selectedCity.value.id
        const imageLieuPath = `${cityName.toString().toLowerCase().replaceAll(' ', '_').normalize('NFD').replaceAll(/[\u0300-\u036f]/g, "")}/${imageLieu.name}`
        const lieuImageRef = refS(storage, imageLieuPath)

        if (visibilite.value == undefined) {
            visibilite.value = false;
        }

        uploadBytes(lieuImageRef, imageLieu)
        setPlace(
            description.value,
            0,
            idCreateur!,
            cityId,
            imageLieuPath,
            latitude.value,
            longitude.value,
            nom.value,
            visibilite.value
        )

        setOpenPlace(false)

        const toast = await toastController.create({
            message: "Lieu ajouté!",
            duration: 3000
        })
        await toast.present()
    }

}

function getPlaceImage(ev: any) {
    imageLieu = ev.target.files[0]
}

function reset() {
    setOpenPlace(false)

    nom = ref()
    description = ref()
    latitude = ref()
    longitude = ref()
    visibilite = ref()
    selectedCity = ref()
}
</script>