import { ref } from "vue";
import { state, loadIdDocAgency, loadAgencyLogoPathAndUrl } from "./services/firebase-service";

let isItemFromAgencyList = ref<boolean[]>([])

//Fonction vérifiant si l'item est commandité ou non par une agence
async function checkIfAgency(itemsList: any[]) {
    await loadIdDocAgency()
    isItemFromAgencyList.value = []
    itemsList.forEach(element => {
        if (state.idDocAgencyList.includes(element.id_createur)) {
            isItemFromAgencyList.value.push(true)
        }
        else {
            isItemFromAgencyList.value.push(false)
        }
    })
}

//Fonction chargeant le logo de l'agence si l'item est commandité par une agence de voyage
async function showAgencyLogo(itemsList: any[]) {
    await checkIfAgency(itemsList)
    for (let i = 0; i < isItemFromAgencyList.value.length; i++) {
        if (isItemFromAgencyList.value[i] == true) {
            await loadAgencyLogoPathAndUrl(itemsList[i].id_createur, itemsList[i].id + "agencyLogo", itemsList[i].id + "agencyWeb")
        }
    }
}

export { showAgencyLogo, isItemFromAgencyList }