const apiKey = "2b76fdc8dc3bd4e4a78ae2cf198131bd";

const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");
const weatherInfo = document.getElementById("weatherInfo");
const errorDiv = document.getElementById("error");

searchBtn.addEventListener("click", getWeatherByCity);
locationBtn.addEventListener("click", getWeatherByLocation);

async function getWeatherByCity() {
    const city = document.getElementById("cityInput").value.trim();

    if (!city) {
        errorDiv.innerText = "Please enter a city name.";
        return;
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    fetchWeather(url);
}

function getWeatherByLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
            fetchWeather(url);
        }, () => {
            errorDiv.innerText = "Unable to retrieve your location.";
        });
    } else {
        errorDiv.innerText = "Geolocation is not supported by this browser.";
    }
}

async function fetchWeather(url) {
    try {
        errorDiv.innerText = "";
        weatherInfo.innerHTML = "Loading...";

        const response = await fetch(url);
        const data = await response.json();

        if (data.cod !== 200) {
            weatherInfo.innerHTML = "";
            errorDiv.innerText = data.message;
            return;
        }

        displayWeather(data);
    } catch (error) {
        weatherInfo.innerHTML = "";
        errorDiv.innerText = "Failed to fetch weather data.";
    }
}

function displayWeather(data) {
    const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    weatherInfo.innerHTML = `
        <h3>${data.name}, ${data.sys.country}</h3>
        <img src="${iconUrl}" alt="Weather icon">
        <p><strong>${data.main.temp}°C</strong></p>
        <p>${data.weather[0].description}</p>
        <p>Feels like: ${data.main.feels_like}°C</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind Speed: ${data.wind.speed} m/s</p>
    `;
}
