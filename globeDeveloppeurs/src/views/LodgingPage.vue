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
                <ion-row class="ion-justify-content-center" v-for="(item, index) in state.lodgingList" :key="item.id">
                    <ion-card>
                        <img :id="'lodging' + item.id" class="card_image" />
                        <ion-card-header>
                            <ion-card-title>{{ item.nom }}</ion-card-title>
                        </ion-card-header>
                        <ion-card-content>
                            <p>{{ item.description }}</p>
                            <p>Cote : {{ item.cote }}</p>
                            <p>Catégorie : {{ item.categorie }}</p>

                            <ion-row class="ion-justify-content-between">
                                <ion-button fill="clear"
                                    :href="'https://www.google.com/maps/search/?api=1&query= ' + item.latitude + ',' + item.longitude"
                                    target="blank">
                                    <ion-icon :ios="locationOutline" :md="locationOutline"></ion-icon>
                                </ion-button>
                                <ion-button :href="item.siteWeb" target="blank" fill="clear">
                                    <ion-icon :ios="globeOutline" :md="globeOutline"></ion-icon>
                                </ion-button>
                                <ion-button v-if="!isAdmin" fill="clear" @click="addToWishList(item.id)">
                                    <ion-icon :ios="heartOutline" :md="heartOutline"></ion-icon>
                                </ion-button>
                                <ion-button fill="clear"
                                    :router-link="'/reviews/' + item.nom + '/' + state.docIdList[index] + '/' + COLLECTION_LODGING">
                                    <ion-icon :ios="chatbubbleOutline" :md="chatbubbleOutline"></ion-icon>
                                    <ion-text>&nbsp;({{ state.reviewsCountList[index] }})</ion-text>
                                </ion-button>
                                <ion-button v-if="isAdmin == true" fill="clear" @click="editHotel(item)">
                                    <ion-icon class="open-modal-edit" :ios="pencilOutline" :md="pencilOutline"></ion-icon>
                                </ion-button>
                                <ion-button v-if="isAdmin == true" @click="presentAlert(item)" fill="clear">
                                    <ion-icon :ios="trashOutline" :md="trashOutline"></ion-icon>
                                </ion-button>
                            </ion-row>

                            <ion-grid>
                                <ion-row class="ion-justify-content-center">
                                    <ion-item :id="String(item.id)" lines="none" v-if="isItemFromAgencyList[index] == true">
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
                <ion-fab-button color="primary" @click="addHotel()">
                    <ion-icon id="visibility" class="open-modal" :icon="add"></ion-icon>
                    <ion-modal :is-open="isOpenHotel" @didDismiss="reset()">
                        <ion-header>
                            <ion-toolbar>
                                <ion-title class="ion-text-center">{{ modalTitleHotel }}</ion-title>
                                <ion-buttons slot="end">
                                    <ion-button fill="clear" @click="setOpenHotel(false)">
                                        <ion-icon :icon="close" color="primary"></ion-icon>
                                    </ion-button>
                                </ion-buttons>
                            </ion-toolbar>
                        </ion-header>
                        <ion-content>
                            <ion-item>
                                <ion-input clear-input type="text" :value="oneHotel.nom" v-model="nom"
                                    label="Nom de l'hôtel" label-placement="floating"></ion-input>
                            </ion-item>
                            <ion-item id="addNewHotelPic" style="display:inline">
                                <label>Ajouter une nouvelle image :&emsp;</label>
                                <input type="file" label-placement="floating" @change="getLodgingImage($event)">
                            </ion-item>
                            <ion-item>
                                <ion-input clear-input type="text" :value="oneHotel.description" v-model="description"
                                    label="Description de l'hôtel" label-placement="floating"></ion-input>
                            </ion-item>
                            <ion-item>
                                <ion-input clear-input type="text" :value="oneHotel.cote" v-model="cote" label="Cote"
                                    label-placement="floating"></ion-input>
                            </ion-item>
                            <ion-item>
                                <ion-input clear-input type="text" :value="oneHotel.categorie" v-model="categorie"
                                    label="Catégorie" label-placement="floating"></ion-input>
                            </ion-item>
                            <ion-item>
                                <ion-input clear-input type="number" :value="oneHotel.latitude" v-model="latitude"
                                    label="Latitude" label-placement="floating"></ion-input>
                            </ion-item>
                            <ion-item lines="none">
                                <ion-input clear-input type="number" :value="oneHotel.longitude" v-model="longitude"
                                    label="Longitude" label-placement="floating"></ion-input>
                            </ion-item>
                            <ion-item>
                                <ion-input clear-input type="text" :value="oneHotel.siteWeb" v-model="siteWeb"
                                    label="Site web" label-placement="floating"></ion-input>
                            </ion-item>
                            <ion-item>
                                <ion-toggle justify="start" class="ion-margin-end" :checked="oneHotel.visibilite"
                                    v-model="visibilite">Visibilité</ion-toggle>
                            </ion-item><br>
                            <ion-text class="ion-padding-start">Tous tous les champs sont obligatoires</ion-text><br>
                            <ion-buttons fill="clear" class="ion-justify-content-center ion-padding-vertical">
                                <ion-button color="primary" @click="setHotel">{{ btnModalHotel }}</ion-button>
                            </ion-buttons>
                        </ion-content>
                    </ion-modal>
                </ion-fab-button>
            </ion-fab>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { db, loadLodging, state, COLLECTION_LODGING, auth, addDocumentToWishList, storage, deleteLodging, setLodging, getUser, getReviewsCount, COLLECTION_REVIEWS } from '@/services/firebase-service';
import { IonPage, IonHeader, IonToolbar, IonContent, IonItem, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonIcon, IonTitle, IonButtons, IonBackButton, IonButton, IonGrid, IonRow, IonAvatar, IonLabel, IonText, alertController, IonModal, IonFab, IonFabButton, IonInput, toastController, IonToggle, onIonViewWillEnter } from '@ionic/vue';
import { locationOutline, globeOutline, heartOutline, chatbubbleOutline, add, close, pencilOutline, trashOutline } from 'ionicons/icons'
import { useRoute, useRouter } from 'vue-router';
import { onSnapshot, collection } from "firebase/firestore";
import NavBar from "@/components/NavBar.vue";
import { ref } from 'vue';
import { Lodging } from '@/Lodging';
import { uploadBytes, ref as refS, deleteObject } from 'firebase/storage';
import { showAgencyLogo, isItemFromAgencyList } from '@/agency_items'

const route = useRoute()
const router = useRouter()
let cityId: number = Number(route.params.id)
let cityName = route.params.name

let modalTitleHotel = ref("")
let btnModalHotel = ref("")
let isOpenHotel = ref(false)
let oneHotel = ref(<Lodging>{})
let showField = document.getElementById('#addNewHotelPic')
let nom = ref()
let description = ref()
let cote = ref()
let categorie = ref()
let latitude = ref()
let longitude = ref()
let visibilite = ref()
let siteWeb = ref()
let idCreateur = auth.currentUser?.uid
let imageHotel: any
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

// Écouteur de la collection hebergements de la bd
onSnapshot(collection(db, COLLECTION_LODGING), async () => {
    await loadLodging(cityId)
    await showAgencyLogo(state.lodgingList)
})

// Écouteur de la collection avis de la bd
onSnapshot(collection(db, COLLECTION_REVIEWS), async () => {
    await getReviewsCount(COLLECTION_LODGING, cityId)
})

async function addToWishList(itemId: any) {
    let user = auth.currentUser

    if (user) {
        addDocumentToWishList('hebergements', itemId, user.uid)

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

//Gestion de l'ouverture de la modale ajouter/modifier un hôtel
function setOpenHotel(state: boolean) {
    isOpenHotel.value = state
}

//Ajouter un hôtel
function addHotel() {
    oneHotel.value = <Lodging>{}
    modalTitleHotel.value = "Ajouter un hôtel"
    btnModalHotel.value = "Ajouter"
    setOpenHotel(true)
}

//Modifier un hôtel
function editHotel(hotel: Lodging) {
    oneHotel.value = hotel
    modalTitleHotel.value = "Modifier un hôtel"
    btnModalHotel.value = "Modifier"
    showField?.style.setProperty('display', 'inline')
    setOpenHotel(true)
}

//Gestion du lancement de l'alerte pour supprimer un lieu avec l'icone "trash"
const presentAlert = async (hotel: Lodging) => {
    const alert = await alertController.create({
        header: 'Supprimer un hôtel',
        message: 'Voulez-vous vraiment supprimer cet hôtel ?',
        buttons: [
            { text: 'Non' },
            {
                text: 'Oui',
                handler: () => {
                    deleteObject(refS(storage, hotel.imageHebergement))
                    deleteLodging(hotel.id)
                }
            }
        ]
    })
    await alert.present()
}

async function setHotel() {
    //New lodging
    if (Object.keys(oneHotel.value).length == 0) {
        if (categorie.value == '' || categorie.value == undefined || cote.value == '' || cote.value == undefined || description.value == '' || description.value == undefined || latitude.value == '' || latitude.value == undefined || longitude.value == '' || longitude.value == undefined || imageHotel == undefined || nom.value == '' || nom.value == undefined || siteWeb.value == '' || siteWeb.value == undefined) {
            const toast = await toastController.create({
                message: "Merci de remplir tous les champs!",
                duration: 3000
            })
            await toast.present()
        } else {
            const imageHotelPath = `${cityName.toString().toLowerCase().replaceAll(' ', '_').normalize('NFD').replaceAll(/[\u0300-\u036f]/g, "")}/${imageHotel.name}`
            const hotelImageRef = refS(storage, imageHotelPath)

            if (visibilite.value == undefined) {
                visibilite.value = false;
            }

            let imageReady = await uploadBytes(hotelImageRef, imageHotel)

            if (imageReady) {
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
            }

            setOpenHotel(false)

            const toast = await toastController.create({
                message: "Hôtel ajouté!",
                duration: 3000
            })
            await toast.present()
        }
    } else { //Update
        if (visibilite.value == undefined) {
            visibilite.value = oneHotel.value.visibilite;
        }

        if (imageHotel == undefined) {
            setLodging(
                categorie.value || oneHotel.value.categorie,
                cote.value || oneHotel.value.cote,
                description.value || oneHotel.value.description,
                oneHotel.value.id,
                idCreateur!,
                cityId,
                oneHotel.value.imageHebergement,
                latitude.value || oneHotel.value.latitude,
                longitude.value || oneHotel.value.longitude,
                nom.value || oneHotel.value.nom,
                siteWeb.value || oneHotel.value.siteWeb,
                visibilite.value
            )
        } else {
            const imageHotelPath = `${cityName.toString().toLowerCase().replaceAll(' ', '_').normalize('NFD').replaceAll(/[\u0300-\u036f]/g, "")}/${imageHotel.name}`
            const hotelImageRef = refS(storage, imageHotelPath)

            deleteObject(refS(storage, oneHotel.value.imageHebergement))
            let imageReady = await uploadBytes(hotelImageRef, imageHotel)

            if (imageReady) {
                setLodging(
                    categorie.value || oneHotel.value.categorie,
                    cote.value || oneHotel.value.cote,
                    description.value || oneHotel.value.description,
                    oneHotel.value.id,
                    idCreateur!,
                    cityId,
                    imageHotelPath,
                    latitude.value || oneHotel.value.latitude,
                    longitude.value || oneHotel.value.longitude,
                    nom.value || oneHotel.value.nom,
                    siteWeb.value || oneHotel.value.siteWeb,
                    visibilite.value
                )
            }
        }

        setOpenHotel(false)

        const toast = await toastController.create({
            message: "Hôtel modifié!",
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