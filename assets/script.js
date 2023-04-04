

const weatherApiRootUrl = 'https://api.openweathermap.org';
const weatherApiKey = '0a10568fdd1afdff3817a49dfba38d44'; //this is the same one as the project 1

//Aside DOM elements
const weatherInput = document.querySelector("#weatherInput")
const weatherButton = document.querySelector("#weatherButton")
const searchHistoryDisplay = document.querySelector("#searchHistoryDisplay")

//Main body DOM elements
const weatherDisplay = document.querySelector(".weatherDisplay") //parent
const weatherHeader = document.querySelector(".weatherHeader") //child
const weatherForcast = document.querySelector(".weatherForcast") //child

//day.js DOM elements
const localTime = document.querySelector("#localTime")
const searchTime = document.querySelector("#searchTime")


console.log(dayjs().format("h:mm:ss"))
searchHistoryArr = JSON.parse(localStorage.getItem('searchHistoryArr'));
if( searchHistoryArr === null){
    searchHistoryArr = []
}
console.log(searchHistoryArr[0])

// Creates and sets the clock every second
function setTime(){
    localTime.textContent = dayjs().format("h:mm:ss")
}
setInterval(setTime, 1000)


function displayHistory(history){
    searchHistoryDisplay.innerHTML = ""
    for(let i=0; i<history.length; i++){
        let historyItem = document.createElement("li")
        historyItem.textContent = history[i]
        searchHistoryDisplay.append(historyItem)
        historyItem.addEventListener("click", function(){
            weatherInput.value = historyItem.textContent
            getCoordinates(historyItem.textContent)
        })
    }
}

function displayWeatherHeader(data){
    weatherHeader.innerHTML = ""
    //All the values that will go in the elements
    let name = data.city.name
    let date = dayjs().format('M/D/YYYY')
    let temp = data.list[0].main.temp
    let feelsLikeTemp = data.list[0].main.feels_like
    let windSpeed = data.list[0].wind.speed
    let humidity = data.list[0].main.humidity
    let weatherIconURL = `https://openweathermap.org/img/w/${data.list[0].weather[0].icon}.png`

    //create all elements
    let curWeatherParent = document.createElement("div")
    let curWeatherCardBody = document.createElement("div")
    let cardTitle = document.createElement("h1")
    let cardTemp = document.createElement("p")
    let cardWindSpeed = document.createElement("p")
    let cardHumidity = document.createElement("p")
    let cardIcon= document.createElement("img")

    //style all elements with classes from https://getbootstrap.com/docs/5.0/components/card/
    //give all the element there content
    curWeatherParent.setAttribute('class', 'card')
    curWeatherCardBody.setAttribute('class', 'card-body')
    cardTitle.setAttribute('class', 'card-title')
    cardTitle.textContent = name + " (" + date + ")"
    cardTemp.setAttribute('class', 'card-text')
    cardTemp.textContent = "Actual Temperature: " + temp + "°F, But feels like: " + feelsLikeTemp + "°F"
    cardWindSpeed.setAttribute('class', 'card-text')
    cardWindSpeed.textContent ="Wind Speed: " + windSpeed + " MPH"
    cardHumidity.setAttribute('class', 'card-text')
    cardHumidity.textContent = "Humidity: " + humidity + "%"
    cardIcon.setAttribute("src", weatherIconURL)

    //append all into one card
    curWeatherParent.append(cardTitle)
    cardTitle.append(cardIcon)
    curWeatherParent.append(curWeatherCardBody)
    curWeatherCardBody.append(cardTemp, cardWindSpeed, cardHumidity)

    //append to the html doc
    weatherHeader.append(curWeatherParent)
}

function displayWeatherForcast(data){
    weatherForcast.innerHTML = ""
    let forcastTitle = document.createElement("h1")
    forcastTitle.textContent = "5-day forcast:"
    let forcastBody = document.createElement("div")
    forcastBody.setAttribute('class', 'd-flex')
    forcastBody.setAttribute('style', 'width: 100%')

    for(let i=0; i<40; i +=8){
        console.log(data.list[i])
        //All the values that will go in the elements
        let date = dayjs(data.list[i].dt_txt).format('M/D/YYYY')
        let temp = data.list[i].main.temp
        let humidity = data.list[i].main.humidity
        let windSpeed = data.list[i].wind.speed
        let weatherIconURL = `https://openweathermap.org/img/w/${data.list[0].weather[0].icon}.png`

        //create all elements
        let forcastCard = document.createElement("div")
        let cardDate = document.createElement("h5")
        let cardTemp = document.createElement("p")
        let cardHumidity = document.createElement("p")
        let cardWindSpeed = document.createElement("p")
        let cardWeatherIcon = document.createElement("img")

        //style all elements with classes from https://getbootstrap.com/docs/5.0/components/card/
        //give all the element there content
        forcastCard.setAttribute('class', 'card text-white bg-secondary m-3 p-2')
        forcastCard.setAttribute('style', 'width: 18rem; ')
        cardDate.setAttribute('class', 'card-title')
        cardDate.textContent = date
        cardTemp.setAttribute('class', 'card-text')
        cardTemp.textContent = "Temperature: " + temp + "°F"
        cardHumidity.setAttribute('class', 'card-text')
        cardHumidity.textContent = "Humidity: " + humidity + "%"
        cardWindSpeed.setAttribute('class', 'card-text')
        cardWindSpeed.textContent = "Wind Speed: " + windSpeed + " MPH"
        cardWeatherIcon.setAttribute('src', weatherIconURL)
        cardWeatherIcon.setAttribute('style', 'width: 40%')

        //append all into one card
        forcastCard.append(cardDate, cardWeatherIcon, cardTemp, cardWindSpeed, cardHumidity)

        //append to the the forcastBody
        forcastBody.append(forcastCard)
    }
    //append all to the html doc
    weatherForcast.append(forcastTitle, forcastBody)
    weatherInput.value = ""
}


function getWeather(data){
    let lat = data.lat
    let lon = data.lon
    let requestURL = `${weatherApiRootUrl}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${weatherApiKey}`
    fetch(requestURL)
    .then(function (data) {
      return data.json();
    })
    .then(function (data) {
        displayWeatherHeader(data)
        displayWeatherForcast(data)
    })

}

function getCoordinates(searchInput){
    let requestURL = `${weatherApiRootUrl}/geo/1.0/direct?q=${searchInput}&appid=${weatherApiKey}`
    console.log(requestURL)
    fetch(requestURL)
    .then(function (data) {
      return data.json();
    })
    .then(function (data) {
        if(data.length === 0){
            alert("Location not valid")
            weatherInput.value = ""
        }else{
            console.log(data)
            searchHistoryArr.push(weatherInput.value)
            localStorage.setItem('searchHistoryArr', JSON.stringify(searchHistoryArr))
            displayHistory(searchHistoryArr)
            getWeather(data[0])
        }
    })
}

function Search(){
    getCoordinates(weatherInput.value)
}

function init(){
    displayHistory(searchHistoryArr)
}

init()

weatherButton.addEventListener("click", Search)