function WeatherType(type, img) {
    this.type = type;
    this.img = img
}

const mainContainer = document.getElementById('mainContainer')
const weatherDiv = document.getElementById('weatherDiv')

displayWeather = (data) => {

    const countryCode = data.sys.country
    const cityName = data.name
    const { temp, feels_like, humidity, temp_max, temp_min } = data.main
    let wind = data.wind.deg
    const weatherTypes = [new WeatherType("Clouds", "./images/clouds.png"), new WeatherType("Smoke", "./images/smoke.png"), new WeatherType("Rain", "./images/rain.png"), new WeatherType("Snow", "./images/snow.webp"), new WeatherType("Thunderstorm"), new WeatherType("Clear"), new WeatherType("Drizzle"), new WeatherType("Mist"), new WeatherType("Haze"), new WeatherType("Fog"), new WeatherType("Dust"), new WeatherType("Sand"), new WeatherType("Ash"), new WeatherType("Squall"), new WeatherType("Tornado"), new WeatherType("Extreme")]

    // get date
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const date = new Date();
    const dayOfWeek = daysOfWeek[date.getDay()];
    const month = months[date.getMonth()];
    const dayOfMonth = date.getDate();
    const formattedDate = `${dayOfWeek}, ${month} ${dayOfMonth}`

    // current weather image
    let weatherMatched = false
    let currentWeatherType = data.weather[0].main

    let currentWeatherDescription = data.weather[0].description.slice(0, 1).toUpperCase() + data.weather[0].description.slice(1)
    let image = "https://w7.pngwing.com/pngs/546/46/png-transparent-weather-forecasting-severe-weather-storm-weather-free-text-heart-logo-thumbnail.png"
    for (let i = 0; i < weatherTypes.length; i++) {
        if (weatherTypes[i].type === currentWeatherType) {
            image = weatherTypes[i].img
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
            <p class="temp">${temp} <sup><span class="degree_celsius">ºC</span></sup><br><span class="weather_descrip">${currentWeatherDescription}</span></p>
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
displayError = (error) => {
    let formatteddError = error.message.slice(0, 1).toUpperCase() + error.message.slice(1)
    weatherDiv.innerHTML = `<p class="error_message">${formatteddError}</p>`

}
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


// switch (true) {
//     case cloudCover <= 20:
//         console.log("It's clear or sunny in", cityName);
//         break;
//     case cloudCover <= 40:
//         console.log("It's few clouds in", cityName);
//         break;
//     case cloudCover <= 60:
//         console.log("It's scattered clouds in", cityName);
//         break;
//     case cloudCover <= 80:
//         console.log("It's broken clouds in", cityName);
//         break;
//     default:
//         console.log("It's overcast in", cityName);


// 0 - 10 % Sunny / Clear
// 10 - 20 % Fair
// 20 - 30 % Mostly sunny
// 30 - 60 % Partly cloudy
// 60 - 70 % Partly sunny
// 70 - 90 % Mostly cloudy
// 90 - 100 % Overcast



// const rain = data.rain;
// const snow = data.snow;

// if (rain) {
//     console.log("It's raining in", cityName);
// } else if (snow) {
//     console.log("It's snowing in", cityName);
// } else {
//     console.log("It's not raining or snowing in", cityName)