<template>
    <ion-button fill="clear" @click="setOpenAddQuiz(true)">Quiz</ion-button>
    <ion-modal :is-open="isOpenQuiz" @didDismiss="reset()">
        <ion-header>
            <ion-toolbar>
                <ion-title class="ion-text-center">Ajouter une question</ion-title>
                <ion-buttons slot="end">
                    <ion-button fill="clear" @click="setOpenAddQuiz(false)">
                        <ion-icon :icon="close" color="primary"></ion-icon>
                    </ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <ion-item>
                <ion-select interface="popover" v-model="cityChoice" placeholder="Choisir une ville">
                    <ion-item v-for="city in state.cities">
                        <ion-select-option :value="city.id">{{ city.nom }}</ion-select-option>
                    </ion-item>
                </ion-select>
            </ion-item>
            <ion-item>
                <ion-input v-model="question" clear-input required label="Question" label-placement="floating"></ion-input>
            </ion-item>
            <ion-item>
                <ion-input v-model="choixA" clear-input required label="Choix A" label-placement="floating"></ion-input>
            </ion-item>
            <ion-item>
                <ion-input v-model="choixB" clear-input required label="Choix B" label-placement="floating"></ion-input>
            </ion-item>
            <ion-item>
                <ion-input v-model="choixC" clear-input required label="Choix C" label-placement="floating"></ion-input>
            </ion-item>
            <ion-item>
                <ion-input v-model="choixD" clear-input required label="Choix D" label-placement="floating"></ion-input>
            </ion-item>
            <ion-item>
                <ion-label position="stacked">Réponse</ion-label>
                <ion-radio-group id="choix" v-model="addQuizAnswer" class="ion-padding-vertical">
                    <ion-radio :value="choixA" labelPlacement="end" class="ion-margin-end">A</ion-radio>
                    <ion-radio :value="choixB" labelPlacement="end" class="ion-margin-horizontal">B</ion-radio>
                    <ion-radio :value="choixC" labelPlacement="end" class="ion-margin-horizontal">C</ion-radio>
                    <ion-radio :value="choixD" labelPlacement="end" class="ion-margin-start">D</ion-radio>
                </ion-radio-group>
            </ion-item><br>
            <ion-text class="ion-padding-start">Tous les champs sont obligatoires</ion-text><br>
            <ion-buttons fill="clear" class="ion-justify-content-center ion-padding-vertical">
                <ion-button color="primary"
                    @click="validateNewQuestion(cityChoice, question, choixA, choixB, choixC, choixD, addQuizAnswer)">Enregistrer</ion-button>
            </ion-buttons>
        </ion-content>
    </ion-modal>
    <ion-toast :is-open="isOpenToastAddQuiz" :message="state.addQuizMessage" :duration="5000"
        @didDismiss="setOpenToastAddQuiz(false)" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { state, addQuestionInQuiz, loadCity } from '@/services/firebase-service';
import { IonContent, IonItem, IonIcon, IonTitle, IonButtons, IonButton, IonText, IonModal, IonInput, IonToast, IonHeader, IonToolbar, IonSelect, IonSelectOption, IonRadioGroup, IonRadio, IonLabel } from '@ionic/vue';
import { close } from 'ionicons/icons'

let addQuizAnswer = ref("choix")
let question = ref("")
let choixA = ref()
let choixB = ref()
let choixC = ref()
let choixD = ref()
let isOpenQuiz = ref(false)
let isOpenToastAddQuiz = ref(false)
let cityChoice = ref(0)

if (state.cities.length == 0) {
    loadCity()
}

//Gestion de l'ouverture de la modale ajouter un Lieu
function setOpenAddQuiz(state: boolean) {
    isOpenQuiz.value = state
}

// Fonction qui s'assure que tous les renseignements sont fournis lors de l'ajout d'une question au quiz
async function validateNewQuestion(cityId: number, question: string, choixA: string, choixB: string, choixC: string, choixD: string, reponse: string) {
    if (cityId == 0) {
        setOpenToastAddQuiz(true)
        state.addQuizMessage = "Vous devez sélectionner une ville."
    }
    else if (question == "" || choixA == "" || choixA == undefined || choixB == "" || choixB == undefined || choixC == "" || choixC == undefined || choixD == "" || choixD == undefined) {
        setOpenToastAddQuiz(true)
        state.addQuizMessage = "Veuillez ne laisser aucun champ vide."
    }
    else if (reponse == "choix") {
        setOpenToastAddQuiz(true)
        state.addQuizMessage = "Veuillez indiquer la réponse."
    }
    else {
        setOpenAddQuiz(false)
        await addQuestionInQuiz(cityId, question, choixA, choixB, choixC, choixD, reponse)
        setOpenToastAddQuiz(true)
    }
}

// Fonction qui contrôle l'ouverture du toast associé à l'ajout d'une question au quiz
function setOpenToastAddQuiz(visibility: boolean) {
    isOpenToastAddQuiz.value = visibility
}

function reset() {
    setOpenAddQuiz(false)

    addQuizAnswer = ref("choix")
    question = ref("")
    choixA = ref()
    choixB = ref()
    choixC = ref()
    choixD = ref()
    cityChoice = ref(0)
}

</script>

<style scoped>
#choix {
    display: flex;
}
</style>