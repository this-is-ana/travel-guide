<template>
  <ion-button fill="clear" @click="setOpenHotel(true)">Hébergement</ion-button>
  <ion-modal :is-open="isOpenHotel" @didDismiss="reset()">
    <ion-header>
      <ion-toolbar>
        <ion-title class="ion-text-center">Ajouter un hébergement</ion-title>
        <ion-buttons slot="end">
          <ion-button fill="clear" @click="setOpenHotel(false)">
            <ion-icon :icon="close" color="primary"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-item>
        <ion-input clear-input type="text" v-model="nom" label="Nom de l'hôtel" label-placement="floating"></ion-input>
      </ion-item>
      <ion-item>
        <ion-select aria-label="Villes" interface="popover" placeholder="Ville" justify="start" v-model="selectedCity">
          <ion-item v-for="city in state.cities">
            <ion-select-option :value="city">{{ city.nom }}</ion-select-option>
          </ion-item>
        </ion-select>
      </ion-item>
      <ion-item id="addNewHotelPic" style="display:inline">
        <label>Ajouter une nouvelle image :&emsp;</label>
        <input type="file" label-placement="floating" @change="getLodgingImage($event)">
      </ion-item>
      <ion-item>
        <ion-input clear-input type="text" v-model="description" label="Description de l'hôtel"
          label-placement="floating"></ion-input>
      </ion-item>
      <ion-item>
        <ion-input clear-input type="text" v-model="cote" label="Cote" label-placement="floating"></ion-input>
      </ion-item>
      <ion-item>
        <ion-input clear-input type="text" v-model="categorie" label="Catégorie" label-placement="floating"></ion-input>
      </ion-item>
      <ion-item>
        <ion-input clear-input type="number" v-model="latitude" label="Latitude" label-placement="floating"></ion-input>
      </ion-item>
      <ion-item>
        <ion-input clear-input type="number" v-model="longitude" label="Longitude" label-placement="floating"></ion-input>
      </ion-item>
      <ion-item>
        <ion-input clear-input type="text" v-model="siteWeb" label="Site web" label-placement="floating"></ion-input>
      </ion-item>
      <ion-item>
        <ion-toggle justify="start" class="ion-margin-end" v-model="visibilite">Visibilité</ion-toggle>
      </ion-item><br>
      <ion-text class="ion-padding-start">Tous les champs sont obligatoires</ion-text><br>
      <ion-buttons class="ion-justify-content-center ion-padding-top ion-padding-bottom">
        <ion-button fill="clear" color="primary" @click="setHotel">Ajouter</ion-button>
      </ion-buttons>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { uploadBytes, ref as refS } from 'firebase/storage';
import { auth, storage, setLodging, state, loadCity } from '@/services/firebase-service';
import { IonContent, IonItem, IonIcon, IonTitle, IonButtons, IonButton, IonText, IonModal, IonInput, toastController, IonToggle, onIonViewWillEnter, IonHeader, IonToolbar, IonSelect, IonSelectOption } from '@ionic/vue';
import { close } from 'ionicons/icons'

let isOpenHotel = ref(false)
let nom = ref()
let description = ref()
let cote = ref()
let categorie = ref()
let latitude = ref()
let longitude = ref()
let visibilite = ref()
let siteWeb = ref()
let selectedCity = ref()
let idCreateur = auth.currentUser?.uid
let imageHotel: any

onIonViewWillEnter(() => {
  auth.onAuthStateChanged(currentUser => {
    idCreateur = currentUser?.uid
  })

  if (state.cities.length == 0) {
    loadCity()
  }
})

//Gestion de l'ouverture de la modale ajouter un hôtel
function setOpenHotel(state: boolean) {
  isOpenHotel.value = state
}

async function setHotel() {
  //New lodging
  if (categorie.value == '' || categorie.value == undefined || cote.value == '' || cote.value == undefined || description.value == '' || description.value == undefined || latitude.value == '' || latitude.value == undefined || longitude.value == '' || longitude.value == undefined || imageHotel == undefined || nom.value == '' || nom.value == undefined || siteWeb.value == '' || siteWeb.value == undefined || selectedCity.value == undefined) {
    const toast = await toastController.create({
      message: "Merci de remplir tous les champs!",
      duration: 3000
    })

    await toast.present()
  } else {
    let cityName = selectedCity.value.nom
    let cityId = selectedCity.value.id
    const imageHotelPath = `${cityName.toString().toLowerCase().replaceAll(' ', '_').normalize('NFD').replaceAll(/[\u0300-\u036f]/g, "")}/${imageHotel.name}`
    const hotelImageRef = refS(storage, imageHotelPath)

    if (visibilite.value == undefined) {
      visibilite.value = false;
    }

    uploadBytes(hotelImageRef, imageHotel)

    setLodging(
      categorie.value,
      cote.value,
      description.value,
      0,
      idCreateur!,
      cityId,
      imageHotelPath,
      latitude.value,
      longitude.value,
      nom.value,
      siteWeb.value,
      visibilite.value
    )

    setOpenHotel(false)

    const toast = await toastController.create({
      message: "Hôtel ajouté!",
      duration: 3000
    })
    await toast.present()
  }
}

function getLodgingImage(ev: any) {
  imageHotel = ev.target.files[0]
}

function reset() {
  setOpenHotel(false)

  nom = ref()
  description = ref()
  cote = ref()
  categorie = ref()
  latitude = ref()
  longitude = ref()
  visibilite = ref()
  siteWeb = ref()
  selectedCity = ref()
}
</script>