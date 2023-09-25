<template>
    <ion-button fill="clear" @click="setOpenRestaurant(true)">Restaurant</ion-button>
    <ion-modal :is-open="isOpenRestaurant" @didDismiss="reset()">
        <ion-header>
            <ion-toolbar>
                <ion-title class="ion-text-center">Ajouter un restaurant</ion-title>
                <ion-buttons slot="end">
                    <ion-button fill="clear" @click="setOpenRestaurant(false)">
                        <ion-icon :icon="close" color="primary"></ion-icon>
                    </ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <ion-item>
                <ion-input clear-input type="text" v-model="nom" label="Nom du restaurant"
                    label-placement="floating"></ion-input>
            </ion-item>
            <ion-item>
                <ion-select aria-label="Villes" interface="popover" placeholder="Ville" justify="start"
                    v-model="selectedCity">
                    <ion-item v-for="city in state.cities">
                        <ion-select-option :value="city">{{ city.nom }}</ion-select-option>
                    </ion-item>
                </ion-select>
            </ion-item>
            <ion-item>
                <label>Ajouter une nouvelle image :&emsp;</label>
                <input type="file" label-placement="floating" @change="getRestoImage($event)">
            </ion-item>
            <ion-item>
                <ion-input clear-input type="text" v-model="specialite" label="Spécialité du restaurant"
                    label-placement="floating"></ion-input>
            </ion-item>
            <ion-item>
                <ion-input clear-input type="text" v-model="description" label="Description du restaurant"
                    label-placement="floating"></ion-input>
            </ion-item>
            <ion-item>
                <ion-input clear-input type="text" v-model="cote" label="Côte du restaurant"
                    label-placement="floating"></ion-input>
            </ion-item>
            <ion-item>
                <ion-label position="stacked">Budget du restaurant</ion-label>
                <ion-radio-group id="budget" v-model="budget" class="ion-padding-vertical">
                    <ion-radio value="$" labelPlacement="end" class="ion-margin-end">$</ion-radio>
                    <ion-radio value="$$-$$$" labelPlacement="end" class="ion-margin-horizontal">$$</ion-radio>
                    <ion-radio value="$$$$" labelPlacement="end" class="ion-margin-start">$$$$</ion-radio>
                </ion-radio-group>
            </ion-item>
            <ion-item>
                <ion-input clear-input v-model="contact" type="text" label="Contact" label-placement="floating"></ion-input>
            </ion-item>
            <ion-item>
                <ion-input clear-input v-model="siteWeb" type="text" label="Site Web"
                    label-placement="floating"></ion-input>
            </ion-item>
            <ion-item>
                <ion-toggle justify="start" class="ion-margin-end" v-model="visibilite">Visibilité</ion-toggle>
            </ion-item><br>
            <ion-text class="ion-padding-start">Tous les champs sont obligatoires</ion-text><br>
            <ion-buttons fill="clear" class="ion-justify-content-center ion-padding-vertical">
                <ion-button color="primary" @click="setRestaurant">Ajouter</ion-button>
            </ion-buttons>
        </ion-content>
    </ion-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { uploadBytes, ref as refS } from 'firebase/storage';
import { auth, storage, setResto, state, loadCity } from '@/services/firebase-service';
import { IonContent, IonItem, IonIcon, IonTitle, IonButtons, IonButton, IonText, IonModal, IonInput, toastController, IonToggle, onIonViewWillEnter, IonHeader, IonToolbar, IonSelectOption, IonRadioGroup, IonRadio, IonSelect, IonLabel } from '@ionic/vue';
import { close } from 'ionicons/icons'

let isOpenRestaurant = ref(false)
let budget = ref()
let contact = ref()
let cote = ref()
let description = ref()
let idCreateur = auth.currentUser?.uid
let imageResto: any
let nom = ref()
let siteWeb = ref()
let specialite = ref()
let visibilite = ref()
let selectedCity = ref()

onIonViewWillEnter(() => {
    auth.onAuthStateChanged(currentUser => {
        idCreateur = currentUser?.uid
    })

    if (state.cities.length == 0) {
        loadCity()
    }
})

//Gestion de l'ouverture de la modale ajouter un restaurant
function setOpenRestaurant(state: boolean) {
    isOpenRestaurant.value = state
}

async function setRestaurant() {
    //New restaurant
    if (contact.value == "" || contact.value == undefined || cote.value == "" || cote.value == undefined || description.value == "" || description.value == undefined || nom.value == "" || nom.value == undefined || siteWeb.value == "" || siteWeb.value == undefined || specialite.value == "" || specialite.value == undefined || budget.value == undefined || imageResto == undefined || selectedCity.value == undefined) {
        const toast = await toastController.create({
            message: "Merci de remplir tous les champs!",
            duration: 3000
        })
        await toast.present()
    } else {
        let cityName = selectedCity.value.nom
        let cityId = selectedCity.value.id
        const imageRestoPath = `${cityName.toString().toLowerCase().replaceAll(' ', '_').normalize('NFD').replaceAll(/[\u0300-\u036f]/g, "")}/${imageResto.name}`
        const restoImageRef = refS(storage, imageRestoPath)

        if (visibilite.value == undefined) {
            visibilite.value = false;
        }

        uploadBytes(restoImageRef, imageResto)
        setResto(
            budget.value,
            contact.value,
            cote.value,
            description.value,
            0,
            idCreateur!,
            cityId,
            imageRestoPath,
            nom.value,
            siteWeb.value,
            specialite.value,
            visibilite.value
        )

        setOpenRestaurant(false)

        const toast = await toastController.create({
            message: "Restaurant ajouté!",
            duration: 3000
        })
        await toast.present()
    }
}

function getRestoImage(ev: any) {
    imageResto = ev.target.files[0]
}

function reset() {
    setOpenRestaurant(false)

    budget = ref()
    contact = ref()
    cote = ref()
    description = ref()
    nom = ref()
    siteWeb = ref()
    specialite = ref()
    visibilite = ref()
    selectedCity = ref()
}
</script>

<style scoped>
#budget {
    display: flex;
}
</style>