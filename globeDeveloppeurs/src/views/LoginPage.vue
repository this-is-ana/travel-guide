<template>
    <ion-page>
        <ion-header :translucent="true">
            <ion-toolbar>
                <ion-title>Connexion</ion-title>
                <ion-buttons slot="end">
                    <ion-button @click="$router.push('/home')">
                        <ion-icon slot="icon-only" color="primary" :icon="homeOutline" aria-label="Accueil"></ion-icon>
                    </ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>

        <ion-content :fullscreen="true" class="ion-padding">

            <!-- Login -->
            <ion-row class="ion-justify-content-center ion-align-items-center login-row">
                <ion-col size-sm="12" size-md="6" size-lg="4">
                    <ion-card class="ion-padding-vertical">
                        <ion-card-header>
                            <ion-card-title class="ion-text-center title">Connexion</ion-card-title>
                        </ion-card-header>

                        <ion-card-content>
                            <ion-row class="ion-justify-content-center">
                                <ion-col>
                                    <ion-item class="d-flex align-items-end">
                                        <ion-icon slot="start" class="mr-2" :icon="mail"></ion-icon>
                                        <ion-input clear-input required label="Courriel" labelPlacement="floating"
                                            type="email" inputmode="email" name="loginEmail"
                                            @ionInput="handleChange"></ion-input>
                                    </ion-item>
                                </ion-col>
                            </ion-row>
                            <ion-row class="ion-justify-content-center message ion-hide" id="loginEmail">
                                <ion-text color="danger"></ion-text>
                            </ion-row>
                            <ion-row class="ion-justify-content-center">
                                <ion-col>
                                    <ion-item class="d-flex align-items-end">
                                        <ion-icon slot="start" class="mr-2" :icon="key"></ion-icon>
                                        <ion-input id="pswd" clear-input label="Mot de passe" labelPlacement="floating"
                                            required type="password" name="loginPwd" @ionInput="handleChange"></ion-input>
                                        <ion-icon slot="end" class="mr-2 icon-show" :icon="eye"
                                            @click="showPassword()"></ion-icon>
                                        <ion-icon slot="end" class="mr-2 icon-hide ion-hide" @click="hidePassword()"
                                            :icon="eyeOff"></ion-icon>
                                    </ion-item>
                                </ion-col>
                            </ion-row>
                            <ion-row class="ion-justify-content-center message ion-hide" id="loginPwd">
                                <ion-text color="danger"></ion-text>
                            </ion-row>
                            <ion-row class="ion-justify-content-end">
                                <ion-text color="primary" class="link">Mot de passe perdu?</ion-text>
                            </ion-row>
                        </ion-card-content>

                        <ion-row class="ion-justify-content-center ion-margin-vertical">
                            <ion-button fill="clear" @click="loginUser()">Connexion</ion-button>
                        </ion-row>

                        <ion-row class="ion-justify-content-center ion-margin-vertical">
                            <ion-text class="textSpace">Première utilisation?</ion-text>
                            <ion-text color="primary" class="link" @click="showNewUserForm()">Créez un compte</ion-text>
                        </ion-row>
                    </ion-card>
                </ion-col>
            </ion-row>

            <!-- New Account -->
            <ion-row class="ion-justify-content-center ion-align-items-center new-user-row ion-hide">
                <ion-col size-sm="12" size-md="6" size-lg="4">
                    <ion-card class="ion-padding-vertical">
                        <ion-card-header>
                            <ion-card-title class="ion-text-center">Créer un compte</ion-card-title>
                        </ion-card-header>

                        <ion-card-content>
                            <ion-row class="ion-justify-content-center">
                                <ion-col>
                                    <ion-item class="d-flex align-items-end">
                                        <ion-input clear-input required label="Nom d'utilisateur" labelPlacement="floating"
                                            name="username" @ionInput="handleChange"></ion-input>
                                    </ion-item>
                                </ion-col>
                            </ion-row>
                            <ion-row class="ion-justify-content-center message ion-hide" id="username">
                                <ion-text color="danger"></ion-text>
                            </ion-row>
                            <ion-row class="ion-justify-content-center">
                                <ion-col>
                                    <ion-item class="d-flex align-items-end">
                                        <ion-input clear-input required label="Courriel" labelPlacement="floating"
                                            name="email" type="email" inputmode="email" @ionInput="handleChange">
                                        </ion-input>
                                    </ion-item>
                                </ion-col>
                            </ion-row>
                            <ion-row class="ion-justify-content-center message ion-hide" id="email">
                                <ion-text color="danger"></ion-text>
                            </ion-row>
                            <ion-row class="ion-justify-content-center">
                                <ion-col>
                                    <ion-item class="d-flex align-items-end">
                                        <ion-input clear-input label="Mot de passe" labelPlacement="floating" required
                                            name="password1" type="password" @ionInput="handleChange"></ion-input>
                                    </ion-item>
                                </ion-col>
                            </ion-row>
                            <ion-row class="ion-justify-content-center message ion-hide pswdRow" id="password1">
                                <ion-text color="danger"></ion-text>
                            </ion-row>
                            <ion-row class="ion-justify-content-center">
                                <ion-col>
                                    <ion-item class="d-flex align-items-end">
                                        <ion-input clear-input label="Confirmation mot de passe" labelPlacement="floating"
                                            required name="password2" type="password" @ionInput="handleChange"></ion-input>
                                    </ion-item>
                                </ion-col>
                            </ion-row>
                            <ion-row class="ion-justify-content-center message ion-hide pswdRow" id="password2">
                                <ion-text color="danger"></ion-text>
                            </ion-row>
                        </ion-card-content>

                        <ion-row class="ion-justify-content-center ion-margin-bottom">
                            <ion-button fill="clear" @click="createAccount()">Enregistrer</ion-button>
                        </ion-row>

                        <ion-row class="ion-justify-content-center ion-margin-vertical">
                            <ion-text class="textSpace">Déjà un compte?</ion-text>
                            <ion-text color="primary" class="link" @click="showLoginForm()">Connectez-vous</ion-text>
                        </ion-row>
                    </ion-card>
                </ion-col>
            </ion-row>
        </ion-content>
    </ion-page>
</template>
  
<script lang="ts">
import { IonPage, IonHeader, IonToolbar, IonContent, IonTitle, IonRow, IonCol, IonIcon, IonInput, IonItem, IonCard, IonCardHeader, IonCardContent, IonCardTitle, IonButton, IonText, IonBackButton, IonButtons } from '@ionic/vue';
import { mail, key, eye, eyeOff, homeOutline } from 'ionicons/icons';
import { defineComponent, ref } from 'vue';
import { createUser, getUserByEmail, getByUsername, login, auth } from '../services/firebase-service'
import { validateEmail, validateUsername, validatePassword, handleErrorMsg } from '@/model/form-validation'
import router from '@/router/index';

export default defineComponent({
    name: "LoginPage",
    components: { IonPage, IonHeader, IonToolbar, IonContent, IonTitle, IonRow, IonCol, IonIcon, IonInput, IonItem, IonCard, IonCardHeader, IonCardContent, IonCardTitle, IonButton, IonText, IonBackButton, IonButtons },
    ionViewDidEnter() {
        let ionInputs = document.querySelectorAll('input')

        ionInputs.forEach(ionInput => {
            ionInput.value = '';
        })

        auth.onAuthStateChanged(user => {
            if (user) {
                router.push('/profile');
            }
        })
    },
    setup() {
        const user = ref<{ [key: string]: string }>({
            username: "",
            email: "",
            password1: "",
            password2: "",
            loginEmail: "",
            loginPwd: ""
        });

        const handleChange = (ev: CustomEvent) => {
            const name: string = (ev?.target as any)?.name;
            user.value[name] = ev.detail.value;

            document.querySelector(`#${name}`)!.classList.add("ion-hide")
        };

        let isValid = true;

        return { mail, key, eye, eyeOff, homeOutline, handleChange, user, isValid }
    },
    methods: {
        loginUser() {
            if (validateEmail(this.user.loginEmail) && this.user.loginPwd != '') {
                login(this.user.loginEmail, this.user.loginPwd)
            }

            if (!validateEmail(this.user.loginEmail)) {
                handleErrorMsg(document.querySelector('#loginEmail'), 'Veuillez entrer un courriel valide')
            }

            if (this.user.loginPwd == "") {
                handleErrorMsg(document.querySelector('#loginPwd'), 'Veuillez entrer un mot de passe')
            }
        },

        async createAccount() {
            let response = await this.validate();

            if (response) {
                createUser(this.user.email, this.user.password1, this.user.username)
            }
        },

        async validate() {
            let response = await this.validateIsNew(this.user.username, this.user.email)

            if (!validateEmail(this.user.email)) {
                this.isValid = false;
                handleErrorMsg(document.querySelector('#email'), 'Courriel invalide')
            }

            if (!validateUsername(this.user.username)) {
                this.isValid = false;
                handleErrorMsg(document.querySelector('#username'), "L'identifiant doit être entre 4 et 15 caractères")
            }

            if (!validatePassword(this.user.password1, this.user.password2)) {
                this.isValid = false;
                let rows = document.querySelectorAll('.pswdRow')

                if (this.user.password1 != this.user.password2) {
                    rows.forEach(row => {
                        handleErrorMsg(row, 'Les mots de passe sont différents')
                    })
                } else {
                    rows.forEach(row => {
                        handleErrorMsg(row, 'Veuillez entrer au minimum 6 caractères')
                    })
                }
            }

            return this.isValid && response
        },

        async validateIsNew(username: string, email: string) {
            let resEmail = await getUserByEmail(email) || null
            let resUsername = await getByUsername(username) || null
            let isValid = true

            if (resUsername != null) {
                isValid = false
                handleErrorMsg(document.querySelector('#username'), 'Cet identifiant existe déjà')
            }

            if (resEmail != null) {
                isValid = false
                handleErrorMsg(document.querySelector('#email'), 'Ce courriel existe déjà')
            }

            return isValid
        },

        showNewUserForm() {
            document.querySelector('.new-user-row')?.classList.remove('ion-hide')
            document.querySelector('.login-row')?.classList.add('ion-hide')
        },

        showLoginForm() {
            document.querySelector('.new-user-row')?.classList.add('ion-hide')
            document.querySelector('.login-row')?.classList.remove('ion-hide')
        },

        showPassword() {
            document.querySelector('#pswd')?.setAttribute('type', 'text')
            document.querySelector('.icon-show')?.classList.add('ion-hide')
            document.querySelector('.icon-hide')?.classList.remove('ion-hide')
        },

        hidePassword() {
            document.querySelector('#pswd')?.setAttribute('type', 'password')
            document.querySelector('.icon-show')?.classList.remove('ion-hide')
            document.querySelector('.icon-hide')?.classList.add('ion-hide')
        },
    }
})

</script>

<style scoped>
.link {
    cursor: pointer;
}

.login-row,
.new-user-row {
    height: 100%;
}

.textSpace {
    margin-right: 3px;
}
</style>