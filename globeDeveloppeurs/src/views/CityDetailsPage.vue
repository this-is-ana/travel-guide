<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-back-button @click="router.back()"></ion-back-button>
                </ion-buttons>
                <ion-title mode="ios">{{ oneCity.nom }}</ion-title>
                <NavBar />
            </ion-toolbar>
        </ion-header>

        <ion-content>
            <ion-row class="ion-justify-content-center ion-align-items-center ion-no-padding">
                <ion-col size="auto">
                    <ion-text>{{ localTime }}</ion-text>
                </ion-col>
                <ion-col size="auto">
                    <ion-avatar>
                        <img :src="weatherIconUrl"/>
                    </ion-avatar>
                </ion-col>
                <ion-col size="auto">
                    <ion-text>{{ temperature }}</ion-text>
                </ion-col>
            </ion-row>

            <ion-grid class="ion-no-padding">
                <ion-row class="ion-justify-content-center ion-padding-horizontal">
                    <img :id="'onecity'+cityId" />
                    <ion-text id="description">{{ oneCity.description }}</ion-text>
                </ion-row>
            </ion-grid>

            <!-- Jouer au quiz (voyageur)-->
            <ion-modal :isOpen="isOpenQuiz" id="quiz-modal" @didDismiss="setOpenQuiz(false)">
                <ion-header>
                    <ion-toolbar>
                        <ion-title class="ion-text-center" id="modal-title">Quiz sur {{ oneCity.nom }}</ion-title>
                        <ion-buttons slot="end">
                            <ion-button fill="clear" @click="setOpenQuiz(false)">
                                <ion-icon :icon="close" color="primary"></ion-icon>
                            </ion-button>
                        </ion-buttons>
                    </ion-toolbar>
                </ion-header>
                <ion-content id="modal-content">
                    <p id="question-count">{{ selectedQuestionsIndexList.length }} / 5</p>
                    <p id="question-statement">{{ oneQuestion.question }}</p>
                    <ion-radio-group id="answers-choices" v-model="selectedAnswer">
                        <ion-radio :value="oneQuestion.choixA" label-placement="end"
                            class="answer-choice ion-margin-vertical">{{
                                oneQuestion.choixA }}</ion-radio><br>
                        <ion-radio :value="oneQuestion.choixB" label-placement="end"
                            class="answer-choice ion-margin-bottom">{{
                                oneQuestion.choixB }}</ion-radio><br>
                        <ion-radio :value="oneQuestion.choixC" label-placement="end"
                            class="answer-choice ion-margin-bottom">{{
                                oneQuestion.choixC }}</ion-radio><br>
                        <ion-radio :value="oneQuestion.choixD" label-placement="end"
                            class="answer-choice ion-margin-bottom">{{
                                oneQuestion.choixD }}</ion-radio><br>
                    </ion-radio-group>
                    <ion-buttons fill="clear" class="ion-justify-content-center ion-padding-top ion-padding-bottom">
                        <ion-button color="primary" @click="validateAnswer()">Valider</ion-button>
                    </ion-buttons>
                    <p id="quiz-answer-message">{{ messageAfterAnswer }}</p>
                </ion-content>
            </ion-modal>
            <ion-toast :is-open="isOpenToast" message="Vous devez sélectionner un choix de réponse." :duration="4000"
                @didDismiss="setOpenToast(false)"></ion-toast>
            <ion-alert :is-open="isOpenResult" :header="headerResult" :message="messageResult" :buttons="['OK']"
                @didDismiss="setOpenResult(false)"></ion-alert>

            <!-- Alerte pour la recherche de vols-->
            <ion-alert :is-open="isOpenFlight" :header="headerFlight" :message="messageFlight"
                :buttons="[{ text: 'OK', handler: () => { openSkyScanner(oneCity.codeAeroport) } }]"
                @didDismiss="setOpenFlight(false)"></ion-alert>

        </ion-content>

        <ion-footer>
            <ion-toolbar>
                <ion-grid>
                    <ion-row>
                        <ion-button fill="clear" :router-link="'/restaurants/' + oneCity.id + '/' + oneCity.nom">
                            <div class="icon">
                                <ion-icon :ios="restaurant" :md="restaurant"></ion-icon><br>
                                <p class="iconLabel">Restos</p>
                            </div>
                        </ion-button>
                        <ion-button fill="clear" :router-link="'/places/' + oneCity.id + '/' + oneCity.nom">
                            <div class="icon">
                                <ion-icon :ios="pinOutline" :md="pinOutline"></ion-icon><br>
                                <p class="iconLabel">Lieux</p>
                            </div>
                        </ion-button>
                        <ion-button fill="clear" :router-link="'/lodging/' + oneCity.id + '/' + oneCity.nom">
                            <div class="icon">
                                <ion-icon :ios="bed" :md="bed"></ion-icon><br>
                                <p class="iconLabel">Hôtels</p>
                            </div>
                        </ion-button>
                        <ion-button fill="clear" @click="launchQuiz(oneCity.id)">
                            <div class="icon">
                                <ion-icon :ios="helpCircleOutline" :md="helpCircleOutline"></ion-icon><br>
                                <p class="iconLabel">Quiz</p>
                            </div>
                        </ion-button>
                        <ion-button fill="clear" @click="launchFlightSearch(oneCity.codeAeroport)">
                            <div class="icon">
                                <ion-icon :ios="airplaneOutline" :md="airplaneOutline"></ion-icon><br>
                                <p class="iconLabel">Vols</p>
                            </div>
                        </ion-button>
                    </ion-row>
                </ion-grid>
            </ion-toolbar>
        </ion-footer>
    </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonText, IonGrid, IonRow, IonModal, IonToast, IonAlert, IonRadioGroup, IonRadio, IonContent, IonFooter, IonIcon, IonButton, onIonViewWillEnter, IonAvatar, IonCol } from '@ionic/vue';
import { restaurant, bed, helpCircleOutline, airplaneOutline, pinOutline, close } from 'ionicons/icons';
import { state, getImage } from '@/services/firebase-service'
import { useRoute, useRouter } from 'vue-router'
import { City } from '@/City';
import { launchQuiz, oneQuestion, selectedQuestionsIndexList, messageAfterAnswer, validateAnswer, selectedAnswer, isOpenToast, setOpenToast, isOpenResult, setOpenResult, messageResult, headerResult, isOpenQuiz, setOpenQuiz } from '@/quiz_manager';
import { openSkyScanner, launchFlightSearch, isOpenFlight, messageFlight, headerFlight, setOpenFlight } from '../search_flights';
import { ref } from 'vue'
import { getWeatherAndTime, weatherIconUrl, temperature, localTime } from '@/weather_time';
import NavBar from "@/components/NavBar.vue";

const route = useRoute()
const router = useRouter()
let cityId = Number(route.params.id)
let oneCity: City = {} as City

onIonViewWillEnter(async () => {
    await getCity()
    getImage(oneCity.imageDetails, 'onecity'+cityId)
    getWeatherAndTime(oneCity)
})

async function getCity() {
    for (let item of state.citiesList) {
        if (cityId == item.id) {
            oneCity = item
        }
    }
}
</script>

<style scoped>
.icon {
    align-items: center;
    justify-content: center;
}

ion-card {
    max-width: 50rem;
    flex: 100%;
}

ion-row {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
}

img {
    padding: 10px;
    max-height: 50rem;
    width: 100%;
}

.iconLabel {
    font-size: 8px;
    text-transform: capitalize;
}

ion-text {
    padding: 10px;
}

ion-footer {
    text-align: center;
}

#description {
    line-height: 1.4;
}

#quiz-modal {
    -width: fit-content;
    --min-width: 250p;
    -height: fit-content;
}

#modal-title {
    text-align: center;
}

#question-count {
    text-align: right;
    margin-right: 20px;
}

#question-statement,
.answer-choice,
#quiz-answer-message {
    margin-left: 20px;
}
</style>