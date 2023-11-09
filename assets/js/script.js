var APIKey = "f20b9b519975bf1af641675c0ce5af97";
var form = document.querySelector('form');
var cityInput = document.getElementById('city-input');
var currentWeatherContainer = document.getElementById('currentWeather');
var fiveDayForecastContainer = document.getElementById('fiveDayForecast');
var pastSearchesContainer = document.getElementById('past-searches');

form.addEventListener('submit', function (event) {
    event.preventDefault();
    var cityName = cityInput.value.trim();
    if (cityName !== '') {
        saveToSearchHistory(cityName);
        fetchFiveDayForecast(cityName);
        fetchCurrentWeather(cityName);
    }
});

function fetchCurrentWeather(city) {
    var currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}&units=metric`;
    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => {
            var cityName = data.name;
            var date = new Date(data.dt * 1000);
            var iconCode = data.weather[0].icon;
            var temperature = data.main.temp;
            var humidity = data.main.humidity;
            var windSpeed = data.wind.speed;
            currentWeatherContainer.innerHTML = `
                <div class="col">
                    <h2>${cityName} (${date.toLocaleDateString()})</h2>
                    <img src="https://openweathermap.org/img/wn/${iconCode}.png" alt="Weather Icon">
                    <p>Temperature: ${temperature} °C</p>
                    <p>Humidity: ${humidity}%</p>
                    <p>Wind Speed: ${windSpeed} MPH>
                </div>
            `;
        })
        .catch(error => {
            console.error('Error fetching current weather:', error);
        });
}

function fetchFiveDayForecast(city) {
    var forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${APIKey}&units=metric`;
    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            var groupedForecasts = groupForecastsByDate(data.list);
            displayFiveDayForecast(groupedForecasts);
        })
        .catch(error => {
            console.error('Error fetching five-day forecast:', error);
        });
}

function groupForecastsByDate(forecasts) {
    return forecasts.reduce((grouped, forecast) => {
        var date = new Date(forecast.dt * 1000).toLocaleDateString();
        if (!grouped[date]) {
            grouped[date] = [];
        }
        grouped[date].push(forecast);
        return grouped;
    }, {});
}

function displayFiveDayForecast(groupedForecasts) {
    var forecastRow = document.createElement('div');
    forecastRow.classList.add('d-flex', 'flex-row');
    Object.values(groupedForecasts).forEach(forecast => {
        var date = new Date(forecast[0].dt * 1000);
        var iconCode = forecast[0].weather[0].icon;
        var temperature = forecast[0].main.temp;
        var humidity = forecast[0].main.humidity;
        var windSpeed = forecast[0].wind.speed;
        var forecastCard = document.createElement('div');
        forecastCard.classList.add('col-md-4');
        forecastCard.innerHTML = `
            <div class="card mb-3">
                <div class="card-body">
                    <h5 class="card-title">${date.toLocaleDateString()}</h5>
                    <img src="https://openweathermap.org/img/wn/${iconCode}.png" alt="Weather Icon" class="card-img-top">
                    <p class="card-text">Temperature: ${temperature} °C</p>
                    <p class="card-text">Humidity: ${humidity}%</p>
                    <p class="card-text">Wind Speed: ${windSpeed} MPH>
                </div>
            </div>
        `;
        forecastRow.appendChild(forecastCard);
    });
    fiveDayForecastContainer.innerHTML = ''; 
    fiveDayForecastContainer.appendChild(forecastRow);
}

function saveToSearchHistory(city) {
    var storedCities = JSON.parse(localStorage.getItem('cities')) || [];
    storedCities.unshift(city); 
    storedCities = storedCities.slice(0, 5); 
    localStorage.setItem('cities', JSON.stringify(storedCities));

    displaySearchHistory();
}

function displaySearchHistory() {
    var storedCities = JSON.parse(localStorage.getItem('cities')) || [];
    pastSearchesContainer.innerHTML = '';
    storedCities.forEach(city => {
        var searchHistoryItem = document.createElement('div');
        searchHistoryItem.textContent = city;
        searchHistoryItem.classList.add('list-group-item', 'list-group-item-action');
        pastSearchesContainer.appendChild(searchHistoryItem);
    });
}
