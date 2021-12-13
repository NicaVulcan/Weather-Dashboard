// Global variables
var todayForecast = $("#forecast-today");
var fiveDayForecast = $("#forecast-five-day");
var previousSearchesEl = $("#previous-searches");
var previousSearches = [];

// Get city from search form
$("#search-button").click(function (event) {
    event.preventDefault();

    var citySearchTerm = $("#city-search").val().trim();

    getCity(citySearchTerm);

    // Add link to search history
    $("<li>").text(citySearchTerm).appendTo($("#previous-searches")).addClass("search-item");

    // Set search to local storage
    var searchObj = {
        city: citySearchTerm
    };
    previousSearches = JSON.parse(localStorage.getItem("searches")) || [];
    previousSearches.push(searchObj);
    localStorage.setItem("searches", JSON.stringify(previousSearches));
    var citySearchTerm = $("#city-search").val("");
});

// Populate forecast from search history
$("#previous-searches").click(function(event) {
    var clickedSearchTerm = event.target;
    var citySearchTerm = clickedSearchTerm.textContent;
    getCity(citySearchTerm);
});

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
    //
    var today = moment().format("dddd, MMMM Do YYYY");
    $("#city-details").text(city + ", " + country);
    $("#today-date").text(today);
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
    $("#today-icon").attr("src", "http://openweathermap.org/img/wn/" + icon + "@2x.png").attr("alt","weather icon");

    // Weather details
    $("#today-temp").text("Temp: " + temp + "F°");
    $("#today-wind").text("Wind: " + wind + "MPH");
    $("#today-humid").text("Humidity: " + humid + "%");
    if (uvi < 2) {
        $("#today-uvi").text("UV Index: " + uvi).removeClass().addClass("favorable");
    } else if (uvi < 5) {
        $("#today-uvi").text("UV Index: " + uvi).removeClass().addClass("moderate");
    } else {
        $("#today-uvi").text("UV Index: " + uvi).removeClass().addClass("severe");
    }
};

// Display weather details and icon for 5 day forecast
var displayForecast = function (data) {
    // Dynamically appear heading
    $("#forecast-five-day").css("display", "block");

    // Display weather details for each of 5 following days
    for (var i = 0; i < 5; i++) {
        // Variables
        var icon = data.daily[i].weather[0].icon;
        var tempMax = data.daily[i].temp.max;
        var tempMin = data.daily[i].temp.min;
        var wind = data.daily[i].wind_speed;
        var humid = data.daily[i].humidity;

        // Display date
        var styles = {
            backgroundColor : "#4240d4",
            color: "white",
            borderRadius: "0.1rem"
        }
        var forecastDate = moment().add(i + 1, "days").format("ddd, MMM Do");
        $("#forecast-index-"+i).children(".forecast-date").text(forecastDate).css(styles);

        //Display weather details
        $("#forecast-index-"+i).children(".forecast-icon").attr("src", "http://openweathermap.org/img/wn/" + icon + "@2x.png");
        $("#forecast-index-"+i).children(".forecast-high").text("High Temp: " + tempMax + "F°");
        $("#forecast-index-"+i).children(".forecast-low").text("Low Temp: " + tempMin + "F°");
        $("#forecast-index-"+i).children(".forecast-wind").text("Wind: " + wind + "MPH");
        $("#forecast-index-"+i).children(".forecast-humid").text("Humidity: " + humid + "%");
    }
};

// Display previous searches from local storage
var loadSearches = function () {
    var loadPreviousSearches = JSON.parse(localStorage.getItem("searches")) || [];
    for (var i = 0; i < loadPreviousSearches.length ; i++) {
        $("<li>").text(loadPreviousSearches[i].city).appendTo($("#previous-searches")).addClass("search-item");
    }

};

loadSearches();


