import { Quiz } from './Quiz'
import { loadQuiz, state } from './services/firebase-service'
import { ref } from 'vue'

let questionSelection = 0 // Variable pour le choix d'une question au hasard, entre 0 et 9
let selectedQuestionsIndexList: number[] = [] // Tableau pour stocker les indices des questions choisies
let selectedAnswer = ref("") // Variable enregistrant la réponse choisie par l'utilisateur
let correctAnswersCount = 0 // Compteur de bonnes réponses
let oneQuestion = ref({} as Quiz) // Variable pour stocker un objet Quiz correspondant à la question choisie
let messageAfterAnswer = ref("") // Message s'affichant après chaque réponse à une question
let isOpenQuiz = ref(false) // Variable pour l'ouverture du modal du quiz
let isOpenToast = ref(false) // Variable pour l'ouverture du toast lorsqu'aucun choix n'est sélectionné
let isOpenResult = ref(false) // Variable pour l'ouverture de le fenêtre de dialogue affichant les résultats obtenus au quiz
let messageResult = ref("") // Contenu du message affiché dans la fenêtre de dialogue des résultats
let headerResult = ref("") // En-tête de la fenêtre de dialogue des résultats

// Fonction qui charge les questions pour la ville choisie et sélectionne une 1re question lorsqu'il l'utilisateur tape sur l'icône du quiz
async function launchQuiz(cityId: number) {
    selectedQuestionsIndexList = []
    correctAnswersCount = 0
    await loadQuiz(cityId)
    selectQuestion()
}

// Fonction sélectionnant une question aléatoirement
function selectQuestion() {
    questionSelection = Math.floor(Math.random() * state.questionsList.length)

    if (selectedQuestionsIndexList.length == 0) {
        openDialog()
    }
    else if (selectedQuestionsIndexList.length == 5) {
        displayResults()
    }
    else {
        validateQuestionSelection()
    }
}

// Fonction ouvrant le modal du quiz
function openDialog() {
    selectedQuestionsIndexList.push(questionSelection)
    oneQuestion.value = state.questionsList[questionSelection]
    messageAfterAnswer.value = ""
    setOpenQuiz(true)    
}

// Fonction qui s'assure que la même question n'est pas sélectionéée plus d'une fois dans un jeu
function validateQuestionSelection() {
   if (selectedQuestionsIndexList.includes(questionSelection)) {
    selectQuestion()
   }
   else {
    openDialog()
   }
}

// Fonction qui valide si la réponse sélectionnée par l'utilisateur est la bonne; elle incrémente le compteur de bonnes réponses si c'est le cas et affiche un message
function validateAnswer() {
    let correctAnswer = state.questionsList[questionSelection].reponse

    if (selectedAnswer.value == "") {
        setOpenToast(true)

        return
    } else {
        if (selectedAnswer.value == correctAnswer) {
            messageAfterAnswer.value = "Bonne réponse!"
            correctAnswersCount += 1
        } else {
            messageAfterAnswer.value = `Mauvaise réponse, la bonne réponse est ${correctAnswer}.`
        }
    }
    
    setTimeout(() => { setOpenQuiz(false); selectQuestion()}, 3000)
}

// Fonction qui contrôle l'ouverture du modal du quiz
function setOpenQuiz(state: boolean) {
    isOpenQuiz.value = state

    selectedAnswer.value = ""
}

// Fonction qui contrôle l'ouverture du toast lorsqu'aucune réponse n'est sélectionnée
function setOpenToast(state: boolean) {
    isOpenToast.value = state
}

// Fonction qui contrôle l'ouverture de la fenêtre de dialogue affichant les résultats
function setOpenResult(state: boolean) {
    isOpenResult.value = state
}

// Fonction qui choisit le message à afficher dans la fenêtre de dialogue des résultats en fonction du nombre de bonnes réponses
function displayResults() {
    headerResult.value = "Résultats"
    const commonResultsMessage = `Vous avez obtenu ${correctAnswersCount} bonne(s) réponse(s) sur 5.`
    
    switch(correctAnswersCount) {
        case  0:
            messageResult.value = `${commonResultsMessage} Vous ne pourrez que mieux faire la prochaine fois!`
            break
        case 1:
            messageResult.value = `${commonResultsMessage} Nous vous proposons de réessayer le quiz.`
            break
        case 2:
            messageResult.value = `${commonResultsMessage} En relisant bien l'information disponible dans l'application, vous ferez mieux.`
            break
        case 3:
            messageResult.value = `${commonResultsMessage} Pas si mal, avec un peu plus de pratique, vous deviendrez très bon!.`
            break
        case 4:
            messageResult.value = `${commonResultsMessage} Très bien! Un peu plus, vous aviez un score parfait!`
            break
        case 5:
            messageResult.value = `${commonResultsMessage} Excellent! Vous êtes un expert de cette ville.`
            break
    }
    setOpenResult(true)
}

export { launchQuiz, oneQuestion, selectedQuestionsIndexList, messageAfterAnswer, validateAnswer, selectedAnswer, isOpenToast, setOpenToast, isOpenResult, setOpenResult, messageResult, headerResult, isOpenQuiz, setOpenQuiz }