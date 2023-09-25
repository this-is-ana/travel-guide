<template>
    <ion-button fill="clear" expand="block" @click="setOpenRequests(true)">Demandes d'ajout</ion-button>
    <ion-modal :is-open="isOpenRequests" @didDismiss="setOpenRequests(false)">
        <ion-header>
            <ion-toolbar>
                <ion-title class="ion-text-center">Requêtes d'ajout</ion-title>
                <ion-buttons slot="end">
                    <ion-button fill="clear" @click="setOpenRequests(false)">
                        <ion-icon :icon="close" color="primary"></ion-icon>
                    </ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <ion-row class="ion-padding-bottom">
                <ion-col>
                    <ion-card class="ion-margin-bottom" v-for="(restaurant, index) of restaurantsReq">
                        <ion-card-content>
                            <ion-col>
                                <ion-row class="ion-align-items-center">
                                    <ion-col size="auto" class="ion-padding-end">
                                        <ion-thumbnail>
                                            <img :src="restaurantsSrc[index]" />
                                        </ion-thumbnail>
                                    </ion-col>
                                    <ion-col size="auto">
                                        <ion-card-subtitle>Nom</ion-card-subtitle>
                                        <ion-card-title>{{ restaurant.nom }}</ion-card-title>
                                    </ion-col>
                                </ion-row>
                                <ion-row>
                                    <ion-col size="auto" class="ion-padding-end">
                                        <ion-card-subtitle>Budget</ion-card-subtitle>
                                        <ion-card-title>{{ restaurant.budget }}</ion-card-title>
                                    </ion-col>
                                    <ion-col size="auto" class="ion-padding-end">
                                        <ion-card-subtitle>Cote</ion-card-subtitle>
                                        <ion-card-title>{{ restaurant.cote }}</ion-card-title>
                                    </ion-col>
                                    <ion-col>
                                        <ion-card-subtitle>Spécialité</ion-card-subtitle>
                                        <ion-card-title>{{ restaurant.specialite }}</ion-card-title>
                                    </ion-col>
                                </ion-row>
                                <ion-row>
                                    <ion-col>
                                        <ion-card-subtitle>Contact</ion-card-subtitle>
                                        <ion-card-title>{{ restaurant.contact }}</ion-card-title>
                                    </ion-col>
                                </ion-row>
                                <ion-row>
                                    <ion-col>
                                        <ion-card-subtitle>Site Web</ion-card-subtitle>
                                        <ion-card-title>{{ restaurant.siteWeb }}</ion-card-title>
                                    </ion-col>
                                </ion-row>
                                <ion-row>
                                    <ion-col>
                                        <ion-card-subtitle>Description</ion-card-subtitle>
                                        <ion-card-title> {{ restaurant.description }}</ion-card-title>
                                    </ion-col>
                                </ion-row>
                                <ion-row class="ion-justify-content-center">
                                    <ion-item color="ligth">
                                        <ion-select interface="popover" placeholder="Réponse"
                                            @ion-change="getReqResponse($event, 'restaurants', restaurant.id)">
                                            <ion-select-option value="yes">Accepter</ion-select-option>
                                            <ion-select-option value="no">Refuser</ion-select-option>
                                        </ion-select>
                                    </ion-item>
                                </ion-row>
                            </ion-col>
                        </ion-card-content>
                    </ion-card>

                    <ion-card class="ion-margin-bottom" v-for="(place, index) of placesReq">
                        <ion-card-content>
                            <ion-col>
                                <ion-row class="ion-align-items-center">
                                    <ion-col size="auto" class="ion-padding-end">
                                        <ion-thumbnail>
                                            <img :src="placesSrc[index]"/>
                                        </ion-thumbnail>
                                    </ion-col>
                                    <ion-col size="auto">
                                        <ion-card-subtitle>Nom</ion-card-subtitle>
                                        <ion-card-title>{{ place.nom }}</ion-card-title>
                                    </ion-col>
                                </ion-row>
                                <ion-row>
                                    <ion-col size="auto" class="ion-padding-end">
                                        <ion-card-subtitle>Longitude</ion-card-subtitle>
                                        <ion-card-title>{{ place.longitude }}</ion-card-title>
                                    </ion-col>
                                    <ion-col>
                                        <ion-card-subtitle>Latitude</ion-card-subtitle>
                                        <ion-card-title>{{ place.latitude }}</ion-card-title>
                                    </ion-col>
                                </ion-row>
                                <ion-row>
                                    <ion-col>
                                        <ion-card-subtitle>Description</ion-card-subtitle>
                                        <ion-card-title> {{ place.description }}</ion-card-title>
                                    </ion-col>
                                </ion-row>
                                <ion-row class="ion-justify-content-center">
                                    <ion-item color="ligth">
                                        <ion-select interface="popover" placeholder="Réponse"
                                            @ion-change="getReqResponse($event, 'lieux', place.id)">
                                            <ion-select-option value="yes">Accepter</ion-select-option>
                                            <ion-select-option value="no">Refuser</ion-select-option>
                                        </ion-select>
                                    </ion-item>
                                </ion-row>
                            </ion-col>
                        </ion-card-content>
                    </ion-card>

                    <ion-card class="ion-margin-bottom" v-for="(lodging, index) of lodgingReq">
                        <ion-card-content>
                            <ion-col>
                                <ion-row class="ion-align-items-center">
                                    <ion-col size="auto" class="ion-padding-end">
                                        <ion-thumbnail>
                                            <img :src="lodgingSrc[index]" />
                                        </ion-thumbnail>
                                    </ion-col>
                                    <ion-col size="auto">
                                        <ion-card-subtitle>Nom</ion-card-subtitle>
                                        <ion-card-title>{{ lodging.nom }}</ion-card-title>
                                    </ion-col>
                                </ion-row>
                                <ion-row>
                                    <ion-col size="auto" class="ion-padding-end">
                                        <ion-card-subtitle>Catégorie</ion-card-subtitle>
                                        <ion-card-title>{{ lodging.categorie }}</ion-card-title>
                                    </ion-col>
                                    <ion-col>
                                        <ion-card-subtitle>Cote</ion-card-subtitle>
                                        <ion-card-title>{{ lodging.cote }}</ion-card-title>
                                    </ion-col>
                                </ion-row>
                                <ion-row>
                                    <ion-col size="auto" class="ion-padding-end">
                                        <ion-card-subtitle>Longitude</ion-card-subtitle>
                                        <ion-card-title>{{ lodging.longitude }}</ion-card-title>
                                    </ion-col>
                                    <ion-col>
                                        <ion-card-subtitle>Latitude</ion-card-subtitle>
                                        <ion-card-title>{{ lodging.latitude }}</ion-card-title>
                                    </ion-col>
                                </ion-row>
                                <ion-row>
                                    <ion-col>
                                        <ion-card-subtitle>Site Web</ion-card-subtitle>
                                        <ion-card-title>{{ lodging.siteWeb }}</ion-card-title>
                                    </ion-col>
                                </ion-row>
                                <ion-row>
                                    <ion-col>
                                        <ion-card-subtitle>Description</ion-card-subtitle>
                                        <ion-card-title> {{ lodging.description }}</ion-card-title>
                                    </ion-col>
                                </ion-row>
                                <ion-row class="ion-justify-content-center">
                                    <ion-item color="ligth">
                                        <ion-select interface="popover" placeholder="Réponse"
                                            @ion-change="getReqResponse($event, 'hebergements', lodging.id)">
                                            <ion-select-option value="yes">Accepter</ion-select-option>
                                            <ion-select-option value="no">Refuser</ion-select-option>
                                        </ion-select>
                                    </ion-item>
                                </ion-row>
                            </ion-col>
                        </ion-card-content>
                    </ion-card>
                </ion-col>
            </ion-row>
        </ion-content>
    </ion-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onSnapshot, DocumentData } from 'firebase/firestore';
import { COLLECTION_REQUESTS, getRequests, getDocumentByDocId, setRequest, getImageUrl } from '@/services/firebase-service';
import { IonContent, IonItem, IonIcon, IonTitle, IonButtons, IonButton, IonModal, IonCardSubtitle, IonCardTitle, toastController, IonHeader, IonToolbar, IonSelect, IonSelectOption, IonRow, IonCol, IonThumbnail, IonCard, IonCardContent } from '@ionic/vue';
import { close } from 'ionicons/icons'

let isOpenRequests = ref(false)
let restaurantsReq = ref()
let placesReq = ref()
let lodgingReq = ref()
let restaurantsSrc = ref<string[]>([])
let placesSrc = ref<string[]>([])
let lodgingSrc = ref<string[]>([])

//Gestion de l'ouverture de la modale requêtes
function setOpenRequests(state: boolean) {
    isOpenRequests.value = state

    if (state) {
        onSnapshot(COLLECTION_REQUESTS, async () => {
            restaurantsReq.value = []
            placesReq.value = []
            lodgingReq.value = []
            restaurantsSrc.value = []
            placesSrc.value = []
            lodgingSrc.value = []

            let requests = await getRequests()

            for (let request of requests) {
                await showList(request)
            }
        })
    }
}

async function showList(docData: DocumentData) {
    let requestData = await getDocumentByDocId(docData.collection, docData.id_doc_item)

    if (requestData != null) {
        if (docData.typeRequete == 'Ajouter' && docData.statutRequete == 'En attente') {
            if (docData.collection == 'restaurants') {
                restaurantsReq.value.push(requestData)
                let imageUrl = await getImageUrl(requestData?.imageResto)
                restaurantsSrc.value.push(imageUrl)
            }

            if (docData.collection == 'lieux') {
                placesReq.value.push(requestData)
                let imageUrl = await getImageUrl(requestData?.imageLieu)
                placesSrc.value.push(imageUrl)
            }

            if (docData.collection == 'hebergements') {
                lodgingReq.value.push(requestData)
                let imageUrl = await getImageUrl(requestData?.imageHebergement)
                lodgingSrc.value.push(imageUrl)
            }
        }
    }
}

async function getReqResponse(ev: any, collection: string, itemId: number) {
    let response = ev.target.value

    if (response == 'yes') {
        setRequest(collection, itemId, 'Accepté', 'Ajouter')

        const toast = await toastController.create({
            message: "Demande d'ajout acceptée",
            duration: 3000
        })
        await toast.present()
    } else {
        setRequest(collection, itemId, 'Refusé', 'Ajouter')

        const toast = await toastController.create({
            message: "Demande d'ajout refusée",
            duration: 3000
        })
        await toast.present()
    }
}
</script>

<style scoped>
ion-thumbnail {
    --size: 100px;
}
</style>