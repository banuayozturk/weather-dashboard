// Selectors
var cityFormEl=document.querySelector("#city-search-form");
var cityInputEl=document.querySelector("#city");
var weatherContainerEl=document.querySelector("#current-weather-container");
var citySearchInputEl = document.querySelector("#searched-city");
var forecastTitle = document.querySelector("#forecast");
var forecastContainerEl = document.querySelector("#fiveday-container");
var pastSearchButtonEl = document.querySelector("#past-search-buttons");

var cities = [];

/*Submits City Name and Calls the Functions to Get Weather Info */
var formSubmit = function(event){
    event.preventDefault();
    var city = cityInputEl.value.trim();
    if(city){
        getWeather(city);
        getWeekdays(city);
        cities.unshift({city});
        cityInputEl.value = "";
        saveSearch();
        pastSearch(city);
    } else{
        alert("Please enter a City");
    }
    
}

//Stores Info To Local Storage
var saveSearch = function(){
    localStorage.setItem("cities", JSON.stringify(cities));
};

//Gets Weather Data
var getWeather = function(city){
    var apiKey = "7b11e7aede6db92ad65062023e931bbb";
    var apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
            displayWeather(data, city);
        });
    });
};

//Displays Date, Image, Temprature,Humidity,Wind
var displayWeather = function(weather, searchCity){
   
   weatherContainerEl.textContent= "";  
   citySearchInputEl.textContent=searchCity;
   
   var currentDate = document.createElement("span")
   currentDate.textContent=" (" + moment(weather.dt.value).format("MMM D, YYYY") + ") ";
   citySearchInputEl.appendChild(currentDate);
  
   var weatherIcon = document.createElement("img")
   weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`);
   citySearchInputEl.appendChild(weatherIcon);

   var temperatureEl = document.createElement("span");
   temperatureEl.textContent = "Temperature: " + weather.main.temp + " °F";
   temperatureEl.classList = "list-group-item";
   weatherContainerEl.appendChild(temperatureEl);
  
   var humidityEl = document.createElement("span");
   humidityEl.textContent = "Humidity: " + weather.main.humidity + " %";
   humidityEl.classList = "list-group-item";
   weatherContainerEl.appendChild(humidityEl);

   var windSpeedEl = document.createElement("span");
   windSpeedEl.textContent = "Wind Speed: " + weather.wind.speed + " MPH";
   windSpeedEl.classList = "list-group-item";
   weatherContainerEl.appendChild(windSpeedEl);
   
   var lat = weather.coord.lat;
   var lon = weather.coord.lon;
   getUvIndex(lat,lon);
}

//Gets UV Data
var getUvIndex = function(lat,lon){
    var apiKey = "7b11e7aede6db92ad65062023e931bbb";
    var apiURL = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`;
    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
            displayUvIndex(data)
        });
    });
    
}

 //Displays UV
var displayUvIndex = function(index){
    var uvIndexEl = document.createElement("div");
    uvIndexEl.textContent = "UV Index: ";
    uvIndexEl.classList = "list-group-item";
    uvIndexValue = document.createElement("span");
    uvIndexValue.textContent = index.value;
    uvIndexEl.appendChild(uvIndexValue);
    weatherContainerEl.appendChild(uvIndexEl);

    // Styles According to Data
    if(index.value <=2){
        uvIndexValue.classList = "favorable"
    }else if(index.value >2 && index.value<=8){
        uvIndexValue.classList = "moderate "
    }
    else if(index.value >8){
        uvIndexValue.classList = "severe"
    };   
}

// Gets Weekday Data
var getWeekdays = function(city){
    var apiKey = "7b11e7aede6db92ad65062023e931bbb";
    var apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`;

    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
           displayWeekdays(data);
        });
    });
};

// Displays Elements and Styles for Weekdays
var displayWeekdays = function(weather){
    forecastContainerEl.textContent = "";
    forecastTitle.textContent = "5-Day Forecast:";

    var forecast = weather.list;
       for(var i=5; i < forecast.length; i=i+8){
       var dailyForecast = forecast[i];
        
       
       var forecastEl=document.createElement("div");
       forecastEl.classList = "card bg-primary text-light m-2";

       var forecastDate = document.createElement("h5");
       forecastDate.textContent= moment.unix(dailyForecast.dt).format("MMM D, YYYY");
       forecastDate.classList = "card-header text-center";
       forecastEl.appendChild(forecastDate);

       var weatherIcon = document.createElement("img");
       weatherIcon.classList = "card-body text-center";
       weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${dailyForecast.weather[0].icon}@2x.png`);  
       forecastEl.appendChild(weatherIcon);
       
       var forecastTempEl=document.createElement("span");
       forecastTempEl.classList = "card-body text-center";
       forecastTempEl.textContent = "Temp: " + dailyForecast.main.temp + " °F";
       forecastEl.appendChild(forecastTempEl);

       var forecastHumEl=document.createElement("span");
       forecastHumEl.classList = "card-body text-center";
       forecastHumEl.textContent = "Humidity: " + dailyForecast.main.humidity + "  %";
       forecastEl.appendChild(forecastHumEl);
       forecastContainerEl.appendChild(forecastEl);

       var forecastWindEl=document.createElement("span");
       forecastWindEl.classList = "card-body text-center";
       forecastWindEl.textContent = "Wind: " + dailyForecast.wind.speed + " MPH";
       forecastEl.appendChild(forecastWindEl);
       
    }

}
//Sets Searched City as a Button and Adds Style
var pastSearch = function(pastSearch){
 
    pastSearchEl = document.createElement("button");
    pastSearchEl.textContent = pastSearch;
    pastSearchEl.classList = "d-flex w-100 btn-light border p-2 btn btn-primary";
    pastSearchEl.setAttribute("data-city",pastSearch);
    pastSearchEl.setAttribute("type", "submit");
    pastSearchButtonEl.prepend(pastSearchEl);
}

// Works as the Search Button
var pastSearchButton = function(event){
    var city = event.target.getAttribute("data-city")
    if(city){
        getWeather(city);
        getWeekdays(city);
    }
}

//Event Listeners
cityFormEl.addEventListener("submit", formSubmit);
pastSearchButtonEl.addEventListener("click", pastSearchButton);