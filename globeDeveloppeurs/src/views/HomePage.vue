<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Villes</ion-title>
        <NavBar />
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-grid class="ion-padding-horizontal">
        <ion-row class="ion-margin-vertical ion-text-center ion-text-wrap">
          <ion-col size="12" size-md="6" v-for="city in state.citiesList" :key="city.id"
            :router-link="'/details/' + city.id + '/' + city.nom">
            <ion-card>
              <img :id="'city' + city.id" />
              <ion-card-header>
                <ion-card-title>{{ city.nom }}</ion-card-title>
              </ion-card-header>
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonCard, IonGrid, IonRow, IonCardTitle, IonCardHeader, IonCol } from '@ionic/vue';
import { db, loadCity, state, COLLECTION_CITIES } from '@/services/firebase-service'
import { onSnapshot, collection } from 'firebase/firestore';
import NavBar from '@/components/NavBar.vue';

onSnapshot(collection(db, COLLECTION_CITIES), async () => {
  await loadCity()
})
</script>

<style scoped>
img {
  height: 30vw;
  object-fit: cover;
  width: 100%;
}
</style>