import { ref } from "vue"
import { City } from "./City"
import { weatherApi, timeApi } from "./apikeys"

let weatherIconUrl = ref("")
let temperature = ref("")
let localTime = ref("")

// Fonction chargée à l'ouverture de la page CityDetails et qui appelle les fonctions permettant d'obtenir la météo et l'heure locale
async function getWeatherAndTime(oneCity: City) {
    await getWeather(oneCity)
    await getLocalTime(oneCity) 
}

// Fonction faisant un appel à une API pour obtenir la météo
 async function getWeather(oneCity: City) {
    const weatherUrlStart = "https://api.openweathermap.org/data/2.5/weather?lat="
    const weatherUrlMiddle = "&lon="
    const weatherUrlEnd = "&units=metric&appid="
    const openWeatherIconLink = "http://openweathermap.org/img/w/"

    let weatherResponse = await fetch(`${weatherUrlStart}${oneCity.latitude}${weatherUrlMiddle}${oneCity.longitude}${weatherUrlEnd}${weatherApi}`)
    let weatherData = await weatherResponse.json()
    temperature.value = Math.round(weatherData.main.temp) + ' \xB0C'
    weatherIconUrl.value = `${openWeatherIconLink}${weatherData.weather[0].icon}.png`
 }

 // Fonction faisant des appels à une API pour obtenir l'heure locale
 async function getLocalTime(oneCity: City) {
    const timeUrlStart = "https://api.ipgeolocation.io/timezone?apiKey="
    const timeUrlMiddle = "&lat="
    const timeUrlEnd = "&long="

    let timeResponse = await fetch(`${timeUrlStart}${timeApi}${timeUrlMiddle}${oneCity.latitude}${timeUrlEnd}${oneCity.longitude}`)
    let timeData = await timeResponse.json()
    localTime.value = timeData.time_24.substring(0, 5)
 }

 export { getWeatherAndTime, weatherIconUrl, temperature, localTime }