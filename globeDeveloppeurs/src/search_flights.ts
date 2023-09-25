import { Geolocation } from "@capacitor/geolocation";
import { ref } from 'vue'

// Constantes pour l'url connectant au site SkyScanner
const skyScannerUrlStart = "https://skyscanner.net/g/referrals/v1/flights/browse-view/?origin="
const skyScannerUrlMiddle = "&destination="
const skyScannerUrlEnd = "&locale=fr-FR&currency=CAD&market=CA"

// Constantes pour l'api Air Labs
const AIR_LABS_API_KEY = "ca520b62-aaca-496b-9b38-bf2278b15ca7"
const airLabsUrlStart = "https://airlabs.co/api/v9/nearby?lat="
const airLabsUrlMiddle = "&lng="
const airLabsUrlEnd = "&distance=50&api_key="

let latitude = 0
let longitude = 0
let nearestAirportCode = ""
let isOpenFlight = ref(false) // Variable pour l'ouverture de la fenêtre de dialogue associée à la recherche de vols
let messageFlight = ref("") // Message affiché dans la fenêtre de dialogue
let headerFlight = ref("") // En-tête de la fenêtre de dialogue

// Fonction pour obtenir les données de géolocalisation de l'utilisateur
async function getCurrentPosition() {
    const coordinates = await Geolocation.getCurrentPosition();
    latitude = coordinates.coords.latitude
    longitude = coordinates.coords.longitude
}

// Fonction faisant l'appel à l'api Air Labs et qui gère la réponse obtenue
async function launchFlightSearch(destinationAirportCode: string) {
    await getCurrentPosition()
    let apiResponse = await fetch(`${airLabsUrlStart}${latitude}${airLabsUrlMiddle}${longitude}${airLabsUrlEnd}${AIR_LABS_API_KEY}`)
    let data = await apiResponse.json()
   
    if (latitude ==0 || longitude == 0) {
        headerFlight.value = "Message"
        messageFlight.value = "La géolocalisation n'est pas activée sur votre appareil. La recherche de vols sera moins personnalisée.";
        setOpenFlight(true)
    }
    else if (data.response.airports.length == 0) {
        headerFlight.value = "Message"
        messageFlight.value = "Aucun aéroport n'est situé à proximité de votre position actuelle. La recherche de vols sera moins personnalisée. "
        setOpenFlight(true)
    }
    else {
        nearestAirportCode = data.response.airports[0].iata_code
        openSkyScanner(destinationAirportCode)
    }
    
}

// Fonction ouvrant le site Sky Scanner dans une nouvelle fenêtre
function openSkyScanner(destinationAirportCode: string) {
    window.open(`${skyScannerUrlStart}${nearestAirportCode}${skyScannerUrlMiddle}${destinationAirportCode}${skyScannerUrlEnd}`)
}

// Fonction pour contrôler l'ouverture de la fenêtre de dialogue associée à la recherche de vols
function setOpenFlight(state: boolean) {
    isOpenFlight.value = state
}

export { isOpenFlight, messageFlight, headerFlight, openSkyScanner, launchFlightSearch, setOpenFlight }