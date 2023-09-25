<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-title>Profil</ion-title>
                <NavBar />
            </ion-toolbar>
        </ion-header>

        <ion-content :fullscreen="true" class="ion-padding-vertical">

            <ion-row class="ion-justify-content-center ion-padding-horizontal">
                <ion-col size="12" size-md="6" size-lg="4" size-xl="3">
                    <ion-card class="ion-padding">
                        <ion-card-header>
                            <ion-row class="ion-justify-content-center">
                                <ion-avatar>
                                    <img alt="Silhouette of a person's head"
                                        src="https://ionicframework.com/docs/img/demos/avatar.svg" />
                                </ion-avatar>
                            </ion-row>
                            <ion-text class="ion-text-center">
                                <h1>Profil</h1>
                            </ion-text>
                        </ion-card-header>
                        <ion-card-content>
                            <ion-row>
                                <ion-col>
                                    <ion-row>
                                        <ion-card-title>Nom d'utilisateur</ion-card-title>
                                    </ion-row>
                                    <ion-row>
                                        <ion-text>{{ user.username }}</ion-text>
                                    </ion-row>
                                </ion-col>
                            </ion-row>
                            <ion-row>
                                <ion-col>
                                    <ion-row>
                                        <ion-card-title>Courriel</ion-card-title>
                                    </ion-row>
                                    <ion-row>
                                        <ion-text>{{ user.email }}</ion-text>
                                    </ion-row>
                                </ion-col>
                            </ion-row>
                        </ion-card-content>
                    </ion-card>
                </ion-col>
            </ion-row>

            <!-- Admin only -->
            <ion-row v-if="user.userType == 'Admin'">
                <ion-col>
                    <ion-accordion-group expand="inset">
                        <ion-accordion value="first">
                            <ion-item slot="header">
                                <ion-label>Gérer requêtes d'agences</ion-label>
                            </ion-item>
                            <ion-row slot="content" class="ion-padding">
                                <RequestAddModal />
                                <RequestDeleteModal />
                            </ion-row>
                        </ion-accordion>
                        <ion-accordion value="second">
                            <ion-item slot="header">
                                <ion-label>Ajouter une ville</ion-label>
                            </ion-item>
                            <ion-row slot="content" class="ion-padding">
                                <CityModal />
                            </ion-row>
                        </ion-accordion>
                        <ion-accordion value="third">
                            <ion-item slot="header">
                                <ion-label>Ajouter un hégergement, lieu ou restaurant</ion-label>
                            </ion-item>
                            <ion-row slot="content" class="ion-padding">
                                <LodgingModal />
                                <PlaceModal />
                                <RestaurantModal />
                            </ion-row>
                        </ion-accordion>
                        <ion-accordion value="fourth">
                            <ion-item slot="header">
                                <ion-label>Ajouter un quiz</ion-label>
                            </ion-item>
                            <ion-row slot="content" class="ion-padding">
                                <QuizModal />
                            </ion-row>
                        </ion-accordion>
                        <ion-accordion value="fifth">
                            <ion-item slot="header">
                                <ion-label>Modifier mon compte</ion-label>
                            </ion-item>
                            <ion-row slot="content" class="ion-justify-content-center">
                                <ion-col class="ion-padding" size="12" size-md="6" size-lg="4">
                                    <ion-row class="ion-justify-content-center ion-margin-top">
                                        <ion-col>
                                            <ion-item class="d-flex align-items-end">
                                                <ion-icon slot="start" class="mr-2" :icon="mail"></ion-icon>
                                                <ion-input clear-input required label="Courriel" labelPlacement="floating"
                                                    type="email" inputmode="email" @ionInput="handleChange"
                                                    v-model="inputAemail" name="adminEmail">
                                                </ion-input>
                                            </ion-item>
                                        </ion-col>
                                    </ion-row>
                                    <ion-row class="ion-justify-content-center message ion-hide" id="adminEmail">
                                        <ion-text color="danger"></ion-text>
                                    </ion-row>
                                    <ion-row class="ion-justify-content-center">
                                        <ion-col>
                                            <ion-item class="d-flex align-items-end">
                                                <ion-icon slot="start" class="mr-2" :icon="key"></ion-icon>
                                                <ion-input clear-input label="Ancien mot de passe" labelPlacement="floating"
                                                    required @ionInput="handleChange" type="password" name="adminOldPwd">
                                                </ion-input>
                                            </ion-item>
                                        </ion-col>
                                    </ion-row>
                                    <ion-row class="ion-justify-content-center message ion-hide" id="adminOldPwd">
                                        <ion-text color="danger"></ion-text>
                                    </ion-row>
                                    <ion-row class="ion-justify-content-center">
                                        <ion-col>
                                            <ion-item class="d-flex align-items-end">
                                                <ion-icon slot="start" class="mr-2" :icon="key"></ion-icon>
                                                <ion-input id="pswd" clear-input label="Nouveau mot de passe"
                                                    labelPlacement="floating" required @ionInput="handleChange"
                                                    type="password" name="adminPwd">
                                                </ion-input>
                                            </ion-item>
                                        </ion-col>
                                    </ion-row>
                                    <ion-row class="ion-justify-content-center message ion-hide" id="adminPwd">
                                        <ion-text color="danger"></ion-text>
                                    </ion-row>
                                    <ion-buttons fill="clear" class="ion-justify-content-center ion-padding-vertical">
                                        <ion-button color="primary" @click="updateAdmin()">Modifier</ion-button>
                                    </ion-buttons>
                                </ion-col>
                            </ion-row>
                        </ion-accordion>
                    </ion-accordion-group>
                </ion-col>
            </ion-row>

            <!-- User -->
            <ion-row v-else>
                <ion-col>
                    <ion-accordion-group expand="inset">
                        <ion-accordion value="first">
                            <ion-item slot="header">
                                <ion-label>Modifier mon compte</ion-label>
                            </ion-item>
                            <ion-row slot="content" class="ion-justify-content-center">
                                <ion-col class="ion-padding" size="12" size-md="6" size-lg="4">
                                    <ion-row class="ion-justify-content-center ion-margin-top">
                                        <ion-col>
                                            <ion-item class="d-flex align-items-end">
                                                <ion-icon slot="start" class="mr-2" :icon="person"></ion-icon>
                                                <ion-input clear-input required label="Nom d'utilisateur"
                                                    v-model="inputCusername" labelPlacement="floating"
                                                    @ionInput="handleChange" name="clientUsername">
                                                </ion-input>
                                            </ion-item>
                                        </ion-col>
                                    </ion-row>
                                    <ion-row class="ion-justify-content-center message ion-hide" id="clientUsername">
                                        <ion-text color="danger"></ion-text>
                                    </ion-row>
                                    <ion-row class="ion-justify-content-center">
                                        <ion-col>
                                            <ion-item class="d-flex align-items-end">
                                                <ion-icon slot="start" class="mr-2" :icon="mail"></ion-icon>
                                                <ion-input clear-input required label="Courriel" labelPlacement="floating"
                                                    v-model="inputCemail" type="email" inputmode="email"
                                                    @ionInput="handleChange" name="clientEmail">
                                                </ion-input>
                                            </ion-item>
                                        </ion-col>
                                    </ion-row>
                                    <ion-row class="ion-justify-content-center message ion-hide" id="clientEmail">
                                        <ion-text color="danger"></ion-text>
                                    </ion-row>
                                    <ion-row class="ion-justify-content-center">
                                        <ion-col>
                                            <ion-item class="d-flex align-items-end">
                                                <ion-icon slot="start" class="mr-2" :icon="key"></ion-icon>
                                                <ion-input clear-input label="Ancien mot de passe" labelPlacement="floating"
                                                    required @ionInput="handleChange" type="password" name="clientOldPwd">
                                                </ion-input>
                                            </ion-item>
                                        </ion-col>
                                    </ion-row>
                                    <ion-row class="ion-justify-content-center message ion-hide" id="clientOldPwd">
                                        <ion-text color="danger"></ion-text>
                                    </ion-row>
                                    <ion-row class="ion-justify-content-center">
                                        <ion-col>
                                            <ion-item class="d-flex align-items-end">
                                                <ion-icon slot="start" class="mr-2" :icon="key"></ion-icon>
                                                <ion-input clear-input label="Nouveau mot de passe"
                                                    labelPlacement="floating" required @ionInput="handleChange"
                                                    type="password" name="clientPwd">
                                                </ion-input>
                                            </ion-item>
                                        </ion-col>
                                    </ion-row>
                                    <ion-row class="ion-justify-content-center message ion-hide" id="clientPwd">
                                        <ion-text color="danger"></ion-text>
                                    </ion-row>
                                    <ion-buttons fill="clear" class="ion-justify-content-center ion-padding-vertical">
                                        <ion-button color="primary" @click="updateUser()">Modifier</ion-button>
                                    </ion-buttons>
                                </ion-col>
                            </ion-row>
                        </ion-accordion>
                        <ion-accordion value="second">
                            <ion-item slot="header">
                                <ion-label>Voir mes avis</ion-label>
                            </ion-item>
                            <ion-row slot="content" class="ion-padding">
                                <ion-button fill="clear" router-link="/traveler_reviews">Mes avis</ion-button>
                            </ion-row>
                        </ion-accordion>
                        <ion-accordion value="third">
                            <ion-item slot="header">
                                <ion-label>Supprimer mon compte</ion-label>
                            </ion-item>
                            <ion-row slot="content" class="ion-padding">
                                <ion-col>
                                    <ion-text color="primary">Supprimer mon compte</ion-text>
                                </ion-col>
                            </ion-row>
                        </ion-accordion>
                    </ion-accordion-group>
                </ion-col>
            </ion-row>
        </ion-content>
    </ion-page>
</template>
  
<script lang="ts">
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonRow, IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonText, IonItem, IonCol, IonLabel, IonIcon, IonAccordionGroup, IonAccordion, IonInput, IonAvatar, IonButtons } from '@ionic/vue';
import { getUser, auth, updateUser } from '../services/firebase-service'
import { personCircle, mail, key, eye, eyeOff, person } from 'ionicons/icons';
import { defineComponent, ref } from 'vue';
import { validateEmail, validateUsername, handleErrorMsg } from '@/model/form-validation'
import NavBar from '@/components/NavBar.vue';
import router from '@/router/index';
import LodgingModal from '@/components/LodgingModal.vue';
import PlaceModal from '@/components/PlaceModal.vue';
import RestaurantModal from '@/components/RestaurantModal.vue';
import CityModal from '@/components/CityModal.vue';
import QuizModal from '@/components/QuizModal.vue';
import RequestAddModal from '@/components/RequestAddModal.vue';
import RequestDeleteModal from '@/components/RequestDeleteModal.vue';

export default defineComponent({
    components: { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonRow, IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonText, IonItem, IonCol, IonIcon, IonAccordion, IonAccordionGroup, IonInput, IonLabel, IonAvatar, IonButtons, NavBar, LodgingModal, PlaceModal, RestaurantModal, CityModal, QuizModal, RequestAddModal, RequestDeleteModal },
    ionViewWillEnter() {
        auth.onAuthStateChanged(async userData => {
            if (!userData) {
                router.push('/login');
            } else {
                let loggedUser = await getUser(userData);

                this.user.username = loggedUser?.identifiant;
                this.user.email = loggedUser?.courriel;
                this.user.userType = loggedUser?.typeUtilisateur;

                this.modifiedUser.clientUsername = this.user.username;
                this.modifiedUser.clientEmail = this.user.email;

                this.modifiedAdmin.adminUsername = this.user.username;
                this.modifiedAdmin.adminEmail = this.user.email;

                this.inputCusername = this.modifiedUser.clientUsername;
                this.inputCemail = this.modifiedUser.clientEmail;

                this.inputAemail = this.modifiedAdmin.adminEmail;
            }
        })
    },
    setup() {
        const user = ref<{ [key: string]: string }>({
            username: "",
            email: "",
            userType: "",
        });

        const modifiedUser = ref<{ [key: string]: string }>({
            clientUsername: "",
            clientEmail: "",
            clientPwd: "",
            clientOldPwd: ""
        });

        const modifiedAdmin = ref<{ [key: string]: string }>({
            adminUsername: "",
            adminEmail: "",
            adminPwd: "",
            adminOldPwd: "",
        });

        const handleChange = (ev: CustomEvent) => {
            const name: string = (ev?.target as any)?.name;
            modifiedUser.value[name] = ev.detail.value;
            modifiedAdmin.value[name] = ev.detail.value;

            document.querySelector(`#${name}`)!.classList.add("ion-hide")
        };

        let inputCusername = ""
        let inputCemail = ""
        let inputAemail = ""

        return { user, personCircle, mail, key, eye, eyeOff, person, handleChange, modifiedUser, modifiedAdmin, inputCusername, inputCemail, inputAemail }
    },
    methods: {
        updateUser() {
            if (this.validate()) {
                updateUser(this.modifiedUser.clientEmail, this.modifiedUser.clientUsername, this.modifiedUser.clientPwd, this.user.email, this.modifiedUser.clientOldPwd, 'Voyageur')
            }
        },

        updateAdmin() {
            if (this.validateAdmin()) {
                updateUser(this.modifiedAdmin.adminEmail, this.modifiedAdmin.adminUsername, this.modifiedAdmin.adminPwd, this.user.email, this.modifiedAdmin.adminOldPwd, 'Admin')
            }
        },

        validate() {
            let isValid = true;

            if (!validateEmail(this.modifiedUser.clientEmail)) {
                isValid = false;
                handleErrorMsg(document.querySelector('#clientEmail'), 'Courriel invalide')
            }

            if (!validateUsername(this.modifiedUser.clientUsername)) {
                isValid = false;
                handleErrorMsg(document.querySelector('#clientUsername'), "L'identifiant doit être entre 4 et 15 caractères")
            }

            if (this.modifiedUser.clientOldPwd.length < 6) {
                isValid = false;
                handleErrorMsg(document.querySelector('#clientOldPwd'), 'Veuillez entrer au minimum 6 caractères')
            }

            if (this.modifiedUser.clientPwd.length < 6) {
                isValid = false;
                handleErrorMsg(document.querySelector('#clientPwd'), 'Veuillez entrer au minimum 6 caractères')
            }

            return isValid;
        },

        validateAdmin() {
            let isValid = true;

            if (!validateEmail(this.modifiedAdmin.adminEmail)) {
                isValid = false;
                handleErrorMsg(document.querySelector('#adminEmail'), 'Courriel invalide')
            }

            if (this.modifiedAdmin.adminOldPwd.length < 6) {
                isValid = false;
                handleErrorMsg(document.querySelector('#adminOldPwd'), 'Veuillez entrer au minimum 6 caractères')
            }

            if (this.modifiedAdmin.adminPwd.length < 6) {
                isValid = false;
                handleErrorMsg(document.querySelector('#adminPwd'), 'Veuillez entrer au minimum 6 caractères')
            }

            return isValid;
        }
    }
})
</script>
  