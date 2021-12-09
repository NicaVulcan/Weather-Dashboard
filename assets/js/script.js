var todayForecast = $("#forecast-today");
var fiveDayForecast = $("#forecast-five-day");
var i;

// Get city information
var getCity = function (cityName) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=c530b07ee7450bd5ee531ce916c11440&units=imperial";

    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    // Pass city info to corresponding functions
                    displayCityName(data.name, data.sys.country);
                    getWeather(data.coord.lat, data.coord.lon);
                });
            } else {
                alert("Error: City not found");
            }
        });
};

// Get weather information
var getWeather = function (cityLat, cityLon) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + cityLat + "&lon=" + cityLon + "&exclude=minutely,hourly,alerts&appid=c530b07ee7450bd5ee531ce916c11440&units=imperial";

    fetch(apiUrl)
        .then(function (response) {
            response.json().then(function (data) {
                // Pass weather information on to displayToday() and displayForecast()
                displayToday(data);

                displayForecast(data);
            })
        });
};

// Display the name of the city and country, and date
var displayCityName = function (city, country) {
    var today = moment().format("dddd, MMMM Do YYYY");
    $("<h2>").text(city + ", " + country).appendTo(todayForecast).addClass("text-center");
    $("<h3>").text(today).appendTo(todayForecast).addClass("text-center");
};

// Display weather details and icon for current day
var displayToday = function (data) {
    // Variables
    var icon = data.current.weather[0].icon;
    var temp = data.current.temp;
    var wind = data.current.wind_speed;
    var humid = data.current.humidity;
    var uvi = data.current.uvi;

    // Weather icon
    $("<img>").attr("src", "http://openweathermap.org/img/wn/" + icon + "@2x.png").appendTo(todayForecast);

    // Weather details
    $("<p>").text("Temp: " + temp + "F°").appendTo(todayForecast);
    $("<p>").text("Wind: " + wind + "MPH").appendTo(todayForecast);
    $("<p>").text("Humidity: " + humid + "%").appendTo(todayForecast);
    if (uvi <= 2) {
        $("<p>").text("UV Index: " + uvi).appendTo(todayForecast).addClass("favorable");
    } else if (uvi >2 && uvi <=5) {
        $("<p>").text("UV Index: " + uvi).appendTo(todayForecast).addClass("moderate");
    } else {
        $("<p>").text("UV Index: " + uvi).appendTo(todayForecast).addClass("severe");
    }
};

// Display weather details and icon for 5 day forecast
var displayForecast = function (data) {
    console.log(data);
    // Dynamically appear heading
    $("<h2>").text("Five Day Forecast:").appendTo(fiveDayForecast).addClass("text-center");

    // Display weathe details for each of 5 following days
    var fiveDaysEl = $("<div>").appendTo(fiveDayForecast).attr("id", "five-day");

    for (var i = 0; i < 5; i++) {
        // Variables
        var forecastDayEl = $("<div>").appendTo(fiveDaysEl);
        var icon = data.daily[i].weather[0].icon;
        var tempMax = data.daily[i].temp.max;
        var tempMin = data.daily[i].temp.min;
        var wind = data.daily[i].wind_speed;
        var humid = data.daily[i].humidity;

        // Display date
        var forecastDate = moment().add(i + 1, "days").format("ddd, MMM Do");
        $("<h5>").text(forecastDate).appendTo(forecastDayEl);

        //Display weather details
        $("<img>").attr("src", "http://openweathermap.org/img/wn/" + icon + "@2x.png").appendTo(forecastDayEl);
        console.log(forecastDate);
        $("<p>").text("High Temp: " + tempMax + "F°").appendTo(forecastDayEl);
        $("<p>").text("Low Temp: " + tempMin + "F°").appendTo(forecastDayEl);
        $("<p>").text("Wind: " + wind + "MPH").appendTo(forecastDayEl);
        $("<p>").text("Humidity: " + humid + "%").appendTo(forecastDayEl);
    }
};

var citySearchTerm = "sydney"
getCity(citySearchTerm);
