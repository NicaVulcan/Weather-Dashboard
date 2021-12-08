var today = moment().format("dddd, MMMM Do YYYY");
console.log(today);
var getCity = function (cityName) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=c530b07ee7450bd5ee531ce916c11440&units=imperial";

    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    retrieveCoord(data, cityName);
                });
            } else {
                alert("Error: City not found");
            }
        });
};

var retrieveCoord = function (cityData, cityName) {
    var cityLon = cityData.coord.lon;
    var cityLat = cityData.coord.lat;
    // display city name and country
    console.log(cityData.name, cityData.sys.country);
    getWeather(cityLat, cityLon);
}

var getWeather = function(cityLat, cityLon) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + cityLat + "&lon=" + cityLon + "&exclude=minutely,hourly,alerts&appid=c530b07ee7450bd5ee531ce916c11440&units=imperial";

    fetch(apiUrl)
        .then(function(response) {
            response.json().then(function(data) {
                displayWeather(data);
            })
        });
}

var displayWeather = function (weatherData) {
    console.log("temp: " + weatherData.current.temp);
    console.log("wind: " + weatherData.current.wind_speed);
    console.log("humidity: " + weatherData.current.humidity);
    console.log("uv: " + weatherData.current.uvi);
    console.log("icon: " + weatherData.current.weather[0].icon);
    var i = 0;
    console.log("tempmax, tempmin: " + weatherData.daily[i].temp.max, weatherData.daily[i].temp.min);
    console.log("wind: " + weatherData.daily[i].wind_speed);
    console.log("humidity: " + weatherData.daily[i].humidity);
    console.log("uv: " + weatherData.daily[i].uvi);
    console.log("icon: " + weatherData.daily[i].weather[0].icon);
}
var cityName = "masaya"
getCity(cityName);
