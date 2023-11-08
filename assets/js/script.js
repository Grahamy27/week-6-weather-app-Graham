var APIKey = "f20b9b519975bf1af641675c0ce5af97";
var cityInputEl = $('#city-input');
var searchBtn = $('#search-button');
var currentCity;

function getWeather(data) {
    var requestUrl = "api.openweathermap.org/data/3.0/onecall?lat=${data.lat}&lon=${data.lon}&appid={APIKey}"
fetch(requestUrl)
.then(function(response) {
    return response.json();
})
.then(function(data) {
    var currentConditionsEl = $("#currentConditions");
    currentConditionsEl.addClass("border border-primary");

    var cityNameEl = $("<h2>");
    cityNameEl.text(currentCity);
    currentConditionsEl.append(cityNameEl);

    var currentCityDate = data.current.dt;
    currentCityDate = moment
})
}
