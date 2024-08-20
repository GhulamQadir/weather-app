// Constructor function for weather type
function WeatherType(type, img) {
    this.type = type;
    this.img = img
}

const mainContainer = document.getElementById('mainContainer')
const weatherDiv = document.getElementById('weatherDiv')

// showing weather on page
displayWeather = (data) => {

    const countryCode = data.sys.country
    const cityName = data.name
    const { temp, feels_like, humidity, temp_max, temp_min } = data.main
    let wind = data.wind.deg
    const weatherTypes = [new WeatherType("Clouds", "./images/clouds.png"), new WeatherType("Smoke", "./images/smoke.png"), new WeatherType("Rain", "./images/rain.png"), new WeatherType("Snow", "./images/snow.webp"), new WeatherType("Thunderstorm", "./images/thunderstorm.png"), new WeatherType("Clear", "./images/clear.png"), new WeatherType("Drizzle", "./images/drizzle.webp"), new WeatherType("Mist", "./images/mist.png"), new WeatherType("Haze", "./images/haze.png"), new WeatherType("Fog", "./images/fog.png"), new WeatherType("Dust", "./images/dust.png"), new WeatherType("Sand", "./images/sand.png"), new WeatherType("Ash", "./images/ash.png"), new WeatherType("Squall", "./images/squall.png"), new WeatherType("Tornado", "./images/tornado.png"), new WeatherType("Extreme", "./images/extreme.png")]

    // get date
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const date = new Date();
    const dayOfWeek = daysOfWeek[date.getDay()];
    const month = months[date.getMonth()];
    const dayOfMonth = date.getDate();
    const formattedDate = `${dayOfWeek}, ${month} ${dayOfMonth}`

    // current weather image
    let currentWeatherType = data.weather[0].main

    let currentWeatherDescription = data.weather[0].description.slice(0, 1).toUpperCase() + data.weather[0].description.slice(1)
    let image = "https://w7.pngwing.com/pngs/546/46/png-transparent-weather-forecasting-severe-weather-storm-weather-free-text-heart-logo-thumbnail.png"
    for (let i = 0; i < weatherTypes.length; i++) {
        if (weatherTypes[i].type === currentWeatherType) {
            image = weatherTypes[i].img
            if (currentWeatherType === "Rain") {
                document.body.style.backgroundImage = "url('https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/1ca15dfa-1dcd-4e32-81f7-5f47fb6b5b69/dfr99g4-c56a9a87-3c95-46aa-9a22-252833072903.gif?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzFjYTE1ZGZhLTFkY2QtNGUzMi04MWY3LTVmNDdmYjZiNWI2OVwvZGZyOTlnNC1jNTZhOWE4Ny0zYzk1LTQ2YWEtOWEyMi0yNTI4MzMwNzI5MDMuZ2lmIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.ZhbPSYhRoG-ag1ivKos4kwdjo2Ldpiy2dIIlLe5EaV4')"
            }
            break;
        }
    }


    fetch(`https://restcountries.com/v3.1/alpha/${countryCode}`)
        .then(response => response.json())
        .then((country) => {
            console.log(data)
            let countryName = country[0].name.common
            weatherDiv.innerHTML = `
            <p class="cityName">${cityName},<br><span class="countryName">${countryName}</span></p>
            <p class="date">${formattedDate}</p>
            <div class="showWeatherDiv">
            <img class="currentWeatherImg" src="${image}" />
            <p class="temp">${temp}<sup><span class="degree_celsius">ºC</span></sup><br><span class="weather_descrip">${currentWeatherDescription}</span></p>
            </div>
            <div class="max_min">
            <p class="max">Max: ${temp_max}</p>
            <p class="min">Min:  ${temp_min}</p>
            </div>
            <p class="feels-like"><i class="fa-solid fa-temperature-half"></i> Feels like: ${feels_like}</p>
            <div class="humidity_wind_Div">
            <div>
            <img class="humidity_img" src="./images/humidity_img.png">
            <span class="humidity_text">Humidity: ${humidity}</span>
            </div>
            <div>
            <i class="fa-solid fa-wind"></i><span class="wind_text"> Wind: ${wind}</span>
            </div>
            </div>
            </div>
            `
        })
}

// showing error on page
displayError = (error) => {
    let formatteddError = error.message.slice(0, 1).toUpperCase() + error.message.slice(1)
    weatherDiv.innerHTML = `<p class="error_message">${formatteddError}</p>`

}

// main.js
const storedApiKey = JSON.parse(localStorage.getItem('apiKey'));


// getting weather of current city
getWeatherByCurrentLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            let { latitude, longitude } = position.coords
            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=c3278680e3b385ddef9e3a58ce4ebd20`)
                .then(response => response.json())
                .then((data) => {
                    if (data.cod === "404") {
                        displayError(data)
                    } else {
                        displayWeather(data)
                    }
                })
                .catch((error) => {
                    displayError(error)
                })
        })
    }
}
getWeatherByCurrentLocation()


// getting weather of specific city
getWeatherOfSpecificCity = () => {
    let cityName = document.getElementById('cityNameInput').value
    if (cityName) {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=c3278680e3b385ddef9e3a58ce4ebd20`)
            .then(response => response.json())
            .then((data) => {
                if (data.cod === "404") {
                    displayError(data)
                } else {
                    displayWeather(data)
                }
            })
            .catch((error) => {
                displayError(error)
            })
    }
}

