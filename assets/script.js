

const weatherApiRootUrl = 'https://api.openweathermap.org';
const weatherApiKey = '0a10568fdd1afdff3817a49dfba38d44'; //this is the same one as the project 1

//Aside DOM elements
const weatherInput = document.querySelector("#weatherInput")
const weatherButton = document.querySelector("#weatherButton")
const searchHistoryDisplay = document.querySelector("#searchHistoryDisplay")

//Main body DOM elements
const weatherDisplay = document.querySelector("#weatherDisplay") //parent
const weatherHeader = document.querySelector("#weatherHeader") //child
const weatherForcast = document.querySelector("#weatherForcast") //child

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
    searchTime.textContent = dayjs().format("h:mm:ss")
}
setInterval(setTime, 1000)


function displayHistory(history){
    searchHistoryDisplay.innerHTML = ""
    for(let i=0; i<history.length; i++){
        let historyItem = document.createElement("li")
        historyItem.textContent = history[i]
        searchHistoryDisplay.append(historyItem)
        historyItem.addEventListener("click", function(){
            console.log(historyItem.textContent)
        })
    }
}

function Search(){
    searchHistoryArr.push(weatherInput.value)
    console.log(searchHistoryArr)
    localStorage.setItem('searchHistoryArr', JSON.stringify(searchHistoryArr))
    displayHistory(searchHistoryArr)
}

function init(){
    displayHistory(searchHistoryArr)
}

init()

weatherButton.addEventListener("click", Search)