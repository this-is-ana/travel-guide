<template>
    <ion-buttons slot="end">
        <ion-button v-if="router.currentRoute.value.path != '/home'" @click="navigateMenu('/home')">
            <ion-icon slot="icon-only" color="primary" :icon="homeOutline" aria-label="Accueil"></ion-icon>
        </ion-button>
        <ion-button v-if="isLoggedIn == false" @click="navigateMenu('/login')">
            <ion-icon slot="icon-only" color="primary" :icon="personOutline" aria-label="Profil"></ion-icon>
        </ion-button>
        <div v-else>
            <ion-button @click="openPopover($event)">
                <ion-icon slot="icon-only" color="primary" :icon="menu" aria-label="Menu"></ion-icon>
            </ion-button>
            <ion-popover :is-open="popoverOpen" :event="event" @didDismiss="popoverOpen = false">
                <ion-content>
                    <ion-list>
                        <ion-item :button="true" @click="navigateMenu('/profile')">Profil</ion-item>
                        <ion-item :button="true" @click="navigateMenu('/wishlist')" v-if="!isAdmin">Favoris</ion-item>
                        <ion-item :button="true" v-if="!isAdmin" @click="sendMail()">Contactez-nous</ion-item>
                        <ion-item :button="true" v-else @click="goToMail()">Boîte de réception</ion-item>
                        <ion-item :button="true" @click="logout()">Déconnexion</ion-item>
                    </ion-list>
                </ion-content>
            </ion-popover>
        </div>
    </ion-buttons>
</template>

<script setup lang="ts">
import { IonButton, IonButtons, IonIcon, IonList, IonPopover, IonItem, IonContent } from '@ionic/vue';
import { personOutline, homeOutline, menu } from 'ionicons/icons';
import { auth, logout, getUser } from '@/services/firebase-service';
import { ref } from 'vue';
import router from '@/router/index';

let popoverOpen = ref(false)
let isLoggedIn = ref(false)
let isAdmin = ref(false)
let event: null

auth.onAuthStateChanged(async user => {
    if (user != null) {
        isLoggedIn.value = true
        let loggedUser = await getUser(user);

        loggedUser?.typeUtilisateur == 'Admin' ? isAdmin.value = true : isAdmin.value = false
    } else {
        isLoggedIn.value = false
    }
})
   
function openPopover(e: any) {
    event = e;
    popoverOpen.value = true;
}

function navigateMenu(url: string) {
    router.push(url);
}

function goToMail() {
    window.open("mailto:", "_system");
}

function sendMail() {
    window.open("mailto:admin@admin.com", "_system");
}
</script>