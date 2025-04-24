var input = document.querySelector(".search");
var btn = document.querySelector(".search-btn");
var msg = document.querySelector(".search-message");

input.addEventListener("keydown", function (e) {
  if (e.key == "Enter" && input.value.trim() != "") {
    city = input.value;
    getApi(city);
    console.log(input.value);
    input.value = "";
  }
});

btn.addEventListener("click", function () {
  if (input.value.trim() != "") {
    city = input.value;
    getApi(city);
    console.log(input.value);
    input.value = "";
  }
});

function getApi(city) {
  var api = new XMLHttpRequest();
  api.open(
    "Get",
    `https://api.weatherapi.com/v1/forecast.json?key=ecb4816f611e4eddb8e165702252304&q=${city}&days=7`
  );
  api.send();
  api.addEventListener("load", function () {
    console.log(JSON.parse(api.response));
    var data = JSON.parse(api.response);
    if (data.current && data.location && data.forecast.forecastday) {
      msg.classList.add("d-none");
      document.querySelector(".forecast-wrapper").classList.remove("d-none");
      var current = data.current;
      var location = data.location;
      var forecast = data.forecast.forecastday;
      display(location, current);
      forecastDisplay(forecast);
    } else {
      msg.classList.remove("d-none");
      document.querySelector(".forecast-wrapper").classList.add("d-none");
      document.getElementById("forecastData").innerHTML = "";
      document.getElementById("currentWeather").innerHTML = "";
      document.getElementById("windStatus").innerHTML = "";
    }
  });
}

function display(location, current) {
  var date = new Date(location.localtime);
  var days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  var months = [
    "jan",
    "feb",
    "mar",
    "apr",
    "may",
    "jun",
    "jul",
    "aug",
    "sep",
    "oct",
    "nov",
    "dec",
  ];
  var dayName = days[date.getDay()];
  var day = ("0" + date.getDate()).slice(-2);
  var monthName = months[date.getMonth()];
  var formattedDate = `${dayName}, ${day}, ${monthName}`;
  var icon = weatherIcon(current.condition.text, current.is_day);
  box = `
        <div class="location-wrapper d-flex justify-content-between align-items-baseline">
            <div class="location  d-flex align-items-baseline gap-2">
                <i class="fa-solid fa-location-dot"></i>
                <div><h4 class="country">${location.name}</h4> 
                <h6 class="country">${location.country}</h6>
                </div>
                
            </div>
            <h5 class="date regular-txt">${formattedDate}</h5>
            </div>

            <div class="weather-status d-flex justify-content-between align-items-center">
            <img src=${icon} class="weather-img">
            <div class="weather-temp text-end">
                <h1 class="temp">${Math.round(current.temp_c)} °C</h1>
                <h5 class="condition regular-txt">${current.condition.text}</h5>
            </div>
            </div>
        `;
  windBox = `
        <div class="condition-status">
            <i class="fa-solid fa-droplet"></i>
            <div class="pressure-info">
                <h5 class="regular-txt">humidity</h5>
                <h5>${current.humidity}%</h5>
            </div>
            </div>
            <div class="condition-status">
            <i class="fa-solid fa-wind"></i>
            <div class="air-status">
                <h5 class="regular-txt">wind speed</h5>
                <h5>${Math.round(current.wind_kph)} km/h</h5>
            </div>
        </div>
        `;
  document.getElementById("currentWeather").innerHTML = box;
  document.getElementById("windStatus").innerHTML = windBox;
  if (current.is_day == 0) {
    document.body.classList.add("night-mode");
  } else {
    document.body.classList.remove("night-mode");
  }
}

function forecastDisplay(forecast) {
  var forecastBox = "";
  for (var i = 1; i < forecast.length; i++) {
    var day = forecast[i];
    var fDate = new Date(day.date);
    var dayNum = ("0" + fDate.getDate()).slice(-2);
    var monthName = fDate.toLocaleString("default", { month: "short" });
    forecastBox += `
                <div class="forecast-item">
                    <h5 class="item-date">${dayNum} ${monthName}</h5>
                    <img src=${
                      day.day.condition.icon
                    } alt="" class="forecast-img">
                    <h5 class="item-temp">${Math.round(
                      day.day.maxtemp_c
                    )} °C</h5>
                </div>
        `;
  }
  document.getElementById("forecastData").innerHTML = forecastBox;
}

function weatherIcon(condition, isDay) {
  var base = "../assets/weather/";
  condition = condition.toLowerCase();
  var icon = "clear";

  if (condition.includes("partly") || condition.includes("cloud"))
    icon = "clouds";
  else if (condition.includes("rain") || condition.includes("drizzle"))
    icon = "rain";
  else if (condition.includes("sun") || condition.includes("clear"))
    icon = "clear";
  else if (condition.includes("snow") || condition.includes("sleet"))
    icon = "snow";
  else if (condition.includes("thunder")) icon = "thunderstorm";
  else if (
    condition.includes("fog") ||
    condition.includes("mist") ||
    condition.includes("haze")
  )
    icon = "atmosphere";

  if (isDay == 0) {
    return `${base}${icon}-night.svg`;
  } else {
    return `${base}${icon}.svg`;
  }
}

window.addEventListener("load", function () {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      var lat = position.coords.latitude;
      var lon = position.coords.longitude;
      var coords = `${lat},${lon}`;
      getApi(coords);
    });
  } else {
    getApi("Cairo");
  }
});
getApi("Cairo");
