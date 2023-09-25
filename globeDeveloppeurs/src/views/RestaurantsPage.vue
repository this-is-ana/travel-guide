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
                <ion-row class="ion-justify-content-center" v-for="(item, index) in state.restaurantsList" :key="item.id">
                    <ion-card>
                        <img :id="'restaurant' + item.id" class="card_image" />
                        <ion-card-header>
                            <ion-card-title>{{ item.nom }}</ion-card-title>
                        </ion-card-header>
                        <ion-card-content>
                            <p>{{ item.specialite }}</p>
                            <p>{{ item.description }}</p>
                            <p>Cote : {{ item.cote }}</p>
                            <p>Budget : {{ item.budget }}</p>

                            <ion-row class="ion-justify-content-between">
                                <ion-button @click="callRestaurant(item.contact, item.nom)" fill="clear">
                                    <ion-icon :ios="callOutline" :md="callOutline"></ion-icon>
                                </ion-button>
                                <ion-button :href="item.siteWeb" target="blank" fill="clear">
                                    <ion-icon :ios="globeOutline" :md="globeOutline"></ion-icon>
                                </ion-button>
                                <ion-button v-if="!isAdmin" fill="clear" @click="addToWishList(item.id)">
                                    <ion-icon :ios="heartOutline" :md="heartOutline"></ion-icon>
                                </ion-button>
                                <ion-button fill="clear"
                                    :router-link="'/reviews/' + item.nom + '/' + state.docIdList[index] + '/' + COLLECTION_RESTAURANTS">
                                    <ion-icon :ios="chatbubbleOutline" :md="chatbubbleOutline"></ion-icon>
                                    <ion-text>&nbsp;({{ state.reviewsCountList[index] }})</ion-text>
                                </ion-button>
                                <ion-button v-if="isAdmin == true" fill="clear" @click="editRestaurant(item)">
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
                <ion-fab-button color="primary" @click="addRestaurant()">
                    <ion-icon id="visibility" class="open-modal" :icon="add"></ion-icon>
                    <ion-modal :is-open="isOpenRestaurant" @didDismiss="reset()">
                        <ion-header>
                            <ion-toolbar>
                                <ion-title class="ion-text-center">{{ modalTitleRestaurant }}</ion-title>
                                <ion-buttons slot="end">
                                    <ion-button fill="clear" @click="setOpenRestaurant(false)">
                                        <ion-icon :icon="close" color="primary"></ion-icon>
                                    </ion-button>
                                </ion-buttons>
                            </ion-toolbar>
                        </ion-header>
                        <ion-content>
                            <ion-item>
                                <ion-input clear-input type="text" :value="oneRestaurant.nom" v-model="nom"
                                    label="Nom du restaurant" label-placement="floating"></ion-input>
                            </ion-item>
                            <ion-item>
                                <ion-input clear-input type="text" :value="oneRestaurant.specialite" v-model="specialite"
                                    label="Spécialité du restaurant" label-placement="floating"></ion-input>
                            </ion-item>
                            <ion-item>
                                <label>Ajouter une nouvelle image :&emsp;</label>
                                <input type="file" label-placement="floating" @change="getRestoImage($event)">
                            </ion-item>
                            <ion-item>
                                <ion-input clear-input type="text" :value="oneRestaurant.description" v-model="description"
                                    label="Description du restaurant" label-placement="floating"></ion-input>
                            </ion-item>
                            <ion-item>
                                <ion-input clear-input type="text" :value="oneRestaurant.cote" v-model="cote"
                                    label="Côte du restaurant" label-placement="floating"></ion-input>
                            </ion-item>
                            <ion-item>
                                <ion-label position="stacked">Budget du restaurant</ion-label>
                                <ion-radio-group id="budget" :value="oneRestaurant.budget" class="ion-padding-vertical"
                                    v-model="budget">
                                    <ion-radio value="$" labelPlacement="end" class="ion-margin-end">$</ion-radio>
                                    <ion-radio value="$$-$$$" labelPlacement="end"
                                        class="ion-margin-horizontal">$$</ion-radio>
                                    <ion-radio value="$$$$" labelPlacement="end" class="ion-margin-start">$$$$</ion-radio>
                                </ion-radio-group>
                            </ion-item>
                            <ion-item>
                                <ion-input clear-input :value="oneRestaurant.contact" v-model="contact" type="text"
                                    label="Contact" label-placement="floating"></ion-input>
                            </ion-item>
                            <ion-item>
                                <ion-input clear-input :value="oneRestaurant.siteWeb" v-model="siteWeb" type="text"
                                    label="Site Web" label-placement="floating"></ion-input>
                            </ion-item>
                            <ion-item>
                                <ion-toggle justify="start" class="ion-margin-end" :checked="oneRestaurant.visibilite"
                                    v-model="visibilite">Visibilité</ion-toggle>
                            </ion-item><br>
                            <ion-text class="ion-padding-start">Tous les champs sont obligatoires</ion-text><br>
                            <ion-buttons fill="clear" class="ion-justify-content-center ion-padding-vertical">
                                <ion-button color="primary" @click="setRestaurant">{{ btnModalRestaurant }}</ion-button>
                            </ion-buttons>
                        </ion-content>
                    </ion-modal>
                </ion-fab-button>
            </ion-fab>

            <ion-alert :is-open="isOpenPhoneNumber" header="Contact" :message="contactInfo" :buttons="['OK']"
                @didDismiss="setOpenPhoneNumber(false)"></ion-alert>

        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { db, loadRestaurants, state, COLLECTION_RESTAURANTS, auth, addDocumentToWishList, setResto, storage, deleteResto, getUser, COLLECTION_REVIEWS, getReviewsCount } from '@/services/firebase-service';
import { IonPage, IonHeader, IonToolbar, IonContent, IonItem, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonIcon, IonRow, IonGrid, IonTitle, IonButtons, IonBackButton, IonButton, IonFab, IonFabButton, IonLabel, IonInput, IonText, IonModal, IonRadioGroup, IonRadio, IonAlert, alertController, isPlatform, getPlatforms, IonAvatar, toastController, IonToggle, onIonViewWillEnter } from '@ionic/vue';
import { callOutline, globeOutline, heartOutline, chatbubbleOutline, pencilOutline, trashOutline, add, close } from 'ionicons/icons'
import { useRoute, useRouter } from 'vue-router';
import { CallNumber } from '@awesome-cordova-plugins/call-number';
import { onSnapshot, collection } from "firebase/firestore";
import { ref } from 'vue';
import NavBar from "@/components/NavBar.vue";
import { Restaurant } from '@/Restaurant';
import { uploadBytes, ref as refS, deleteObject } from 'firebase/storage';
import { showAgencyLogo, isItemFromAgencyList } from '@/agency_items'

const route = useRoute()
const router = useRouter()
let cityId: number = Number(route.params.id)
let cityName = route.params.name
let isOpenPhoneNumber = ref(false)
let contactInfo = ref("")

let modalTitleRestaurant = ref("")
let btnModalRestaurant = ref("")
let isOpenRestaurant = ref(false)
let oneRestaurant = ref(<Restaurant>{})
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

// Écouteur de la collection restaurants de la bd
onSnapshot(collection(db, COLLECTION_RESTAURANTS), async () => {
    await loadRestaurants(cityId)
    await showAgencyLogo(state.restaurantsList)
})

// Écouteur de la collection avis de la bd
onSnapshot(collection(db, COLLECTION_REVIEWS), async () => {
    await getReviewsCount(COLLECTION_RESTAURANTS, cityId)
})

// Fonction qui contrôle l'ouverture de la fenêtre de dialogue affichant le no de téléphone du restaurant
function setOpenPhoneNumber(state: boolean) {
    isOpenPhoneNumber.value = state
}

// Fonction ouvrant le téléphone pour appeler le restaurant (ou une fenêtre de dialogue avec le no de téléphone si un ordinateur est utilisé)
async function callRestaurant(phoneNumber: string, restaurantName: string) {
    const deviceType = getPlatforms()

    if (isPlatform("desktop")) {
        contactInfo.value = `Numéro de téléphone de ${restaurantName}  : ${phoneNumber}`
        setOpenPhoneNumber(true)
    }
    else {
        CallNumber.callNumber(phoneNumber, true)
    }
}

async function addToWishList(itemId: any) {
    let user = auth.currentUser

    if (user) {
        addDocumentToWishList('restaurants', itemId, user.uid)

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

//Gestion de l'ouverture de la modale ajouter/modifier un restaurant
function setOpenRestaurant(state: boolean) {
    isOpenRestaurant.value = state
}


//Ajouter un restaurant
function addRestaurant() {
    oneRestaurant.value = <Restaurant>{}
    modalTitleRestaurant.value = "Ajouter un restaurant"
    btnModalRestaurant.value = "Ajouter"
    setOpenRestaurant(true)
}

//Modifier un restaurant
function editRestaurant(restaurant: Restaurant) {
    oneRestaurant.value = restaurant
    modalTitleRestaurant.value = "Modifier un restaurant"
    btnModalRestaurant.value = "Modifier"
    setOpenRestaurant(true)
}

//Gestion du lancement de l'alerte pour supprimer un restaurant avec l'icone "trash"
const presentAlert = async (restaurant: Restaurant) => {
    const alert = await alertController.create({
        header: 'Supprimer un restaurant',
        message: 'Voulez-vous vraiment supprimer ce restaurant ?',
        buttons: [
            { text: 'Non' },
            {
                text: 'Oui',
                handler: () => {
                    deleteObject(refS(storage, restaurant.imageResto))
                    deleteResto(restaurant.id)
                }
            }
        ]
    })
    await alert.present()
}

async function setRestaurant() {
    //New restaurant
    if (Object.keys(oneRestaurant.value).length == 0) {
        if (contact.value == "" || contact.value == undefined || cote.value == "" || cote.value == undefined || description.value == "" || description.value == undefined || nom.value == "" || nom.value == undefined || siteWeb.value == "" || siteWeb.value == undefined || specialite.value == "" || specialite.value == undefined || budget.value == undefined || imageResto == undefined) {
            const toast = await toastController.create({
                message: "Merci de remplir tous les champs!",
                duration: 3000
            })
            await toast.present()
        } else {
            const imageRestoPath = `${cityName.toString().toLowerCase().replaceAll(' ', '_').normalize('NFD').replaceAll(/[\u0300-\u036f]/g, "")}/${imageResto.name}`
            const restoImageRef = refS(storage, imageRestoPath)

            if (visibilite.value == undefined) {
                visibilite.value = false;
            }

            let imageReady = await uploadBytes(restoImageRef, imageResto)

            if (imageReady) {
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
            }

            setOpenRestaurant(false)

            const toast = await toastController.create({
                message: "Restaurant ajouté!",
                duration: 3000
            })
            await toast.present()
        }
    } else { //Update
        if (visibilite.value == undefined) {
            visibilite.value = oneRestaurant.value.visibilite;
        }

        if (imageResto == undefined) {
            setResto(
                budget.value || oneRestaurant.value.budget,
                contact.value || oneRestaurant.value.contact,
                cote.value || oneRestaurant.value.cote.toString(),
                description.value || oneRestaurant.value.description,
                oneRestaurant.value.id,
                idCreateur!,
                cityId,
                oneRestaurant.value.imageResto,
                nom.value || oneRestaurant.value.nom,
                siteWeb.value || oneRestaurant.value.siteWeb,
                specialite.value || oneRestaurant.value.specialite,
                visibilite.value
            )
        } else {
            const imageRestoPath = `${cityName.toString().toLowerCase().replaceAll(' ', '_').normalize('NFD').replaceAll(/[\u0300-\u036f]/g, "")}/${imageResto.name}`
            const restoImageRef = refS(storage, imageRestoPath)

            deleteObject(refS(storage, oneRestaurant.value.imageResto))
            let imageReady = await uploadBytes(restoImageRef, imageResto)

            if (imageReady) {
                setResto(
                    budget.value || oneRestaurant.value.budget,
                    contact.value || oneRestaurant.value.contact,
                    cote.value || oneRestaurant.value.cote.toString(),
                    description.value || oneRestaurant.value.description,
                    oneRestaurant.value.id,
                    idCreateur!,
                    cityId,
                    imageRestoPath,
                    nom.value || oneRestaurant.value.nom,
                    siteWeb.value || oneRestaurant.value.siteWeb,
                    specialite.value || oneRestaurant.value.specialite,
                    visibilite.value
                )
            }
        }

        setOpenRestaurant(false)

        const toast = await toastController.create({
            message: "Restaurant modifié!",
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
}
</script>

<style scoped>
ion-card {
    height: fit-content;
    max-width: 50rem;
    flex: 100%;
}

.card_image {
    height: 15rem;
    object-fit: cover;
    width: 100%;
}

.toolbar {
    padding-left: 15px;
    padding-right: 15px;
}

#budget {
    display: flex;
}
</style>