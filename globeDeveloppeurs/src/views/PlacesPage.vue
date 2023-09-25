<template>
    <ion-page>
        <ion-header>
            <ion-toolbar class="toolbar">
                <ion-buttons slot="start">
                    <ion-back-button @click="router.back()"></ion-back-button>
                </ion-buttons>
                <ion-title mode="ios">{{ cityName }}</ion-title>
                <NavBar />
            </ion-toolbar>
        </ion-header>

        <ion-content>
            <ion-grid>
                <ion-row class="ion-justify-content-center" v-for="(item, index) in state.placesList" :key="item.id">
                    <ion-card>
                        <img :id="'place' + item.id" class="card_image" />
                        <ion-card-header>
                            <ion-card-title>{{ item.nom }}</ion-card-title>
                        </ion-card-header>
                        <ion-card-content>
                            <p>{{ item.description }}</p>

                            <ion-row class="ion-justify-content-between">
                                <ion-button fill="clear"
                                    :href="'https://www.google.com/maps/search/?api=1&query= ' + item.latitude + ',' + item.longitude"
                                    target="blank">
                                    <ion-icon :ios="locationOutline" :md="locationOutline"></ion-icon>
                                </ion-button>
                                <ion-button v-if="!isAdmin" fill="clear" @click="addToWishList(item.id)">
                                    <ion-icon :ios="heartOutline" :md="heartOutline"></ion-icon>
                                </ion-button>
                                <ion-button fill="clear"
                                    :router-link="'/reviews/' + item.nom + '/' + state.docIdList[index] + '/' + COLLECTION_PLACES">
                                    <ion-icon :ios="chatbubbleOutline" :md="chatbubbleOutline"></ion-icon>
                                    <ion-text>&nbsp;({{ state.reviewsCountList[index] }})</ion-text>
                                </ion-button>
                                <ion-button v-if="isAdmin == true" fill="clear" @click="editPlace(item)">
                                    <ion-icon class="open-modal-edit" :ios="pencilOutline" :md="pencilOutline"></ion-icon>
                                </ion-button>
                                <ion-button v-if="isAdmin == true" @click="presentAlert(item)" fill="clear">
                                    <ion-icon :ios="trashOutline" :md="trashOutline"></ion-icon>
                                </ion-button>
                            </ion-row>

                            <ion-grid>
                                <ion-row class="ion-justify-content-center">
                                    <ion-item lines="none" v-if="isItemFromAgencyList[index] == true">
                                        <ion-avatar slot="end">
                                            <a :id="item.id + 'agencyWeb'" target="blank"><img
                                                    :id="item.id + 'agencyLogo'" /></a>
                                        </ion-avatar>
                                        <ion-label style="font-size: smaller; margin-top: -5px;">Présenté
                                            par</ion-label>
                                    </ion-item>
                                </ion-row>
                            </ion-grid>

                        </ion-card-content>
                    </ion-card>
                </ion-row>
            </ion-grid>


            <ion-fab v-if="isAdmin == true" slot="fixed" vertical="bottom" horizontal="end">
                <ion-fab-button color="primary" @click="addPlace()">
                    <ion-icon id="visibility" class="open-modal" :icon="add"></ion-icon>
                    <ion-modal :is-open="isOpenPlace" @didDismiss="reset()">
                        <ion-header>
                            <ion-toolbar>
                                <ion-title class="ion-text-center">{{ modalTitlePlace }}</ion-title>
                                <ion-buttons slot="end">
                                    <ion-button fill="clear" @click="setOpenPlace(false)">
                                        <ion-icon :icon="close" color="primary"></ion-icon>
                                    </ion-button>
                                </ion-buttons>
                            </ion-toolbar>
                        </ion-header>
                        <ion-content>
                            <ion-item>
                                <ion-input clear-input type="text" :value="onePlace.nom" v-model="nom" label="Nom du lieu"
                                    label-placement="floating"></ion-input>
                            </ion-item>
                            <ion-item id="addNewHotelPic" style="display:inline">
                                <label>Ajouter une nouvelle image :&emsp;</label>
                                <input type="file" label-placement="floating" @change="getPlaceImage($event)">
                            </ion-item>
                            <ion-item>
                                <ion-input clear-input type="text" :value="onePlace.description" v-model="description"
                                    label="Description du lieu" label-placement="floating"></ion-input>
                            </ion-item>
                            <ion-item>
                                <ion-input clear-input type="number" :value="onePlace.latitude" v-model="latitude"
                                    label="Latitude" label-placement="floating"></ion-input>
                            </ion-item>
                            <ion-item lines="none">
                                <ion-input clear-input type="number" :value="onePlace.longitude" v-model="longitude"
                                    label="Longitude" label-placement="floating"></ion-input>
                            </ion-item>
                            <ion-item>
                                <ion-toggle justify="start" class="ion-margin-end" :checked="onePlace.visibilite"
                                    v-model="visibilite">Visibilité</ion-toggle>
                            </ion-item><br>
                            <ion-text class="ion-padding-start">Tous tous les champs sont obligatoires</ion-text><br>
                            <ion-buttons fill="clear" class="ion-justify-content-center ion-padding-vertical">
                                <ion-button color="primary" @click="setLieu">{{ btnModalPlace }}</ion-button>
                            </ion-buttons>
                        </ion-content>
                    </ion-modal>
                </ion-fab-button>
            </ion-fab>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { db, loadPlaces, state, COLLECTION_PLACES, auth, addDocumentToWishList, storage, deletePlace, setPlace, getUser, getReviewsCount, COLLECTION_REVIEWS } from '@/services/firebase-service';
import { IonPage, IonHeader, IonToolbar, IonContent, IonItem, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonIcon, IonTitle, IonButtons, IonBackButton, IonButton, IonGrid, IonRow, IonAvatar, IonLabel, IonText, alertController, IonModal, IonFab, IonFabButton, IonInput, toastController, onIonViewWillEnter, IonToggle } from '@ionic/vue';
import { locationOutline, heartOutline, chatbubbleOutline, add, pencilOutline, trashOutline, close } from 'ionicons/icons';
import { useRoute, useRouter } from 'vue-router';
import { onSnapshot, collection } from "firebase/firestore";
import NavBar from "@/components/NavBar.vue";
import { ref } from 'vue';
import { Place } from '@/Place';
import { uploadBytes, ref as refS, deleteObject } from 'firebase/storage';
import { showAgencyLogo, isItemFromAgencyList } from '@/agency_items'

const route = useRoute()
const router = useRouter()
let cityId: number = Number(route.params.id)
let cityName = route.params.name

let modalTitlePlace = ref("")
let btnModalPlace = ref("")
let isOpenPlace = ref(false)
let onePlace = ref(<Place>{})
let nom = ref()
let description = ref()
let latitude = ref()
let longitude = ref()
let visibilite = ref()
let idCreateur = auth.currentUser?.uid
let imageLieu: any
let isAdmin = ref(false)

onIonViewWillEnter(async () => {
    auth.onAuthStateChanged(async currentUser => {
        idCreateur = currentUser?.uid

        if (currentUser != null) {
            let loggedUser = await getUser(currentUser);

            if (loggedUser?.typeUtilisateur == 'Admin') {
                isAdmin.value = true
            } else {
                isAdmin.value = false
            }
        }
    })
})

// Écouteur de la collection rieux de la bd
onSnapshot(collection(db, COLLECTION_PLACES), async () => {
    await loadPlaces(cityId)
    await showAgencyLogo(state.placesList)
})
// Écouteur de la collection avis de la bd
onSnapshot(collection(db, COLLECTION_REVIEWS), async () => {
    await getReviewsCount(COLLECTION_PLACES, cityId)
})

async function addToWishList(itemId: any) {
    let user = auth.currentUser

    if (user) {
        addDocumentToWishList('lieux', itemId, user.uid)

        const toast = await toastController.create({
            message: 'Favori ajouté!',
            duration: 2000,
            position: 'bottom',
        });

        await toast.present();
    } else {
        const toast = await toastController.create({
            message: 'Connectez-vous pour ajouter un favori',
            duration: 2000,
            position: 'bottom',
        });

        await toast.present();
    }
}

//Gestion de l'ouverture de la modale ajouter/modifier un Lieu
function setOpenPlace(state: boolean) {
    isOpenPlace.value = state
}

//Ajouter un lieu
function addPlace() {
    onePlace.value = <Place>{}
    modalTitlePlace.value = "Ajouter un lieu"
    btnModalPlace.value = "Ajouter"
    setOpenPlace(true)
}

//Modifier un lieu
function editPlace(place: Place) {
    onePlace.value = place
    modalTitlePlace.value = "Modifier un lieu"
    btnModalPlace.value = "Modifier"
    setOpenPlace(true)
}

//Gestion du lancement de l'alerte pour supprimer un lieu avec l'icone "trash"
const presentAlert = async (lieu: Place) => {
    const alert = await alertController.create({
        header: 'Supprimer un lieu',
        message: 'Voulez-vous vraiment supprimer cet lieu ?',
        buttons: [
            { text: 'Non' },
            {
                text: 'Oui',
                handler: () => {
                    deleteObject(refS(storage, lieu.imageLieu))
                    deletePlace(lieu.id)
                }
            }
        ]
    })
    await alert.present()
}

async function setLieu() {
    //New place
    if (Object.keys(onePlace.value).length == 0) {
        if (description.value == '' || description.value == undefined || nom.value == '' || nom.value == undefined || latitude.value == '' || latitude.value == undefined || longitude.value == '' || longitude.value == undefined || imageLieu == undefined) {
            const toast = await toastController.create({
                message: "Merci de remplir tous les champs!",
                duration: 3000
            })
            await toast.present()
        } else {
            const imageLieuPath = `${cityName.toString().toLowerCase().replaceAll(' ', '_').normalize('NFD').replaceAll(/[\u0300-\u036f]/g, "")}/${imageLieu.name}`
            const lieuImageRef = refS(storage, imageLieuPath)

            if (visibilite.value == undefined) {
                visibilite.value = false;
            }

            let imageReady = await uploadBytes(lieuImageRef, imageLieu)

            if (imageReady) {
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
            }

            setOpenPlace(false)

            const toast = await toastController.create({
                message: "Lieu ajouté!",
                duration: 3000
            })
            await toast.present()
        }
    } else { //Update
        if (visibilite.value == undefined) {
            visibilite.value = onePlace.value.visibilite;
        }

        if (imageLieu == undefined) {
            setPlace(
                description.value || onePlace.value.description,
                onePlace.value.id,
                idCreateur!,
                cityId,
                onePlace.value.imageLieu,
                latitude.value || onePlace.value.latitude,
                longitude.value || onePlace.value.longitude,
                nom.value || onePlace.value.nom,
                visibilite.value
            )
        } else {
            const imageLieuPath = `${cityName.toString().toLowerCase().replaceAll(' ', '_').normalize('NFD').replaceAll(/[\u0300-\u036f]/g, "")}/${imageLieu.name}`
            const lieuImageRef = refS(storage, imageLieuPath)

            deleteObject(refS(storage, onePlace.value.imageLieu))
            let imageReady = await uploadBytes(lieuImageRef, imageLieu)

            if (imageReady) {
                setPlace(
                    description.value || onePlace.value.description,
                    onePlace.value.id,
                    idCreateur!,
                    cityId,
                    imageLieuPath,
                    latitude.value || onePlace.value.latitude,
                    longitude.value || onePlace.value.longitude,
                    nom.value || onePlace.value.nom,
                    visibilite.value
                )
            }
        }

        setOpenPlace(false)

        const toast = await toastController.create({
            message: "Lieu modifié!",
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
}

</script>

<style scoped>
ion-card {
    height: fit-content;
    max-width: 50rem;
    flex: 100%;
}

.toolbar {
    padding-left: 15px;
    padding-right: 15px;
}

.card_image {
    height: 15rem;
    object-fit: cover;
    width: 100%;
}
</style>