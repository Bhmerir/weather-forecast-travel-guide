var APIKEY = "64013b468f23baa21fde4b13a3a2c029";

var colWeather = $(".col-weather")
var searchBtn = $("#search-btn");
var searchedcity = $("#searched-city");
var cityForm = $("#city-form");
var cityName = "";
var cityList = [];

$(function () {
    refreshPage();
});

//------------------------------------------- refresh page -----------------------------------------
function refreshPage(){
    //check if local storage is empty or not
    //if it's Empty, the display of the weather column should be none otherwise block
    colWeather.addClass("invisible");
    cityName = "";
    cityList = JSON.parse(localStorage.getItem("cityList"));
    if(!cityList){
        cityList = [];
    }
    else{
        var len = cityList.length;
        for (var i = 0; i < len; i++) {
            addSearchedButtons(cityList[i]);
        }
    }
}

//--------------------------------------------------------------------------------------------------


//------------------------------------------- search weather ---------------------------------------
searchBtn.on("click", searchWeather);
//This function 
function searchWeather(){
    var searchedCityValue = searchedcity.val().trim();
    var cityWordArray = searchedCityValue.split(",");
    cityName = cityWordArray[0];
    if(cityName){
        //Call APIs
        handleCallingApis();
    }
    else{
        alert("A city name should be inserted!")
        showColWeather(false);
    }
}

//--------------------------------------------------------------------------------------------------

//----------------------------------- Handle calling APIs  ---------------------------------
/*This function is responsible for calling the APIs of Geographical coordinates and weather*/
function handleCallingApis() {
    var coordinates=[];
    var GeoApiUrl = "http://api.openweathermap.org/geo/1.0/direct?q="+cityName+"&appid="+ APIKEY;
    //This fetch brings the response about Geographical coordinates
    fetch(GeoApiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (geoData) {
                //If the city is not found, the length of data list will be empty
                if(geoData.length === 0){
                    alert("The searched city is not found!");
                    searchedcity.val("");
                    showColWeather(false);
                }
                else{
                    //If city is found, the longitude and 
                    coordinates.push(geoData[0].lat);
                    coordinates.push(geoData[0].lon);
                    var weatherApiUrl = "https://api.openweathermap.org/data/2.5/weather?lat="+coordinates[0]+"&lon="+coordinates[1]+"&appid="+ APIKEY;
                    //This fetch brings the response about today's weather
                    fetch(weatherApiUrl).then(function (response) {
                        if (response.ok) {
                            response.json().then(function (todayData) {
                                var today = dayjs();
                                var todayFormatted = today.format("M/D/YYYY");
                                var tempFarenheit = parseFloat(((todayData.main.temp-273)*1.8)+32).toFixed(2);
                                var weatherCondition = {
                                                            date: todayFormatted,
                                                            temp: tempFarenheit,
                                                            wind: todayData.wind.speed,
                                                            humidity: todayData.main.humidity,
                                                            icon: todayData.weather[0].icon
                                                        }
                                showWeatherSituation("today", weatherCondition, true)
                                saveSearchedCity();
                                showColWeather(true);
                            });
                        } else {
                            alert("There is a connection error!")
                        }
                    });
                }
            });
        } else {
            alert("There is a connection error!")
        }
    });
};

//--------------------------------------------------------------------------------------------------

//---------------------------------------- show weather column -------------------------------------
//This function changes the display of the weather column
function showColWeather(showCol)
{
    if(showCol){
        colWeather.removeClass("invisible");
        colWeather.addClass("visible"); 
    }
    else{
        colWeather.removeClass("visible");
        colWeather.addClass("invisible"); 
    }
}
//--------------------------------------------------------------------------------------------------

//----------------------------------------save searched city -------------------------------
//This function adds a new buttun for searched city and save the name of city in local storage 
function saveSearchedCity(){
    //It will add city to the list only if it's not found in the list
    if (cityList.length !== 0) {
        for (var i = 0; i < cityList.length; i++) {
          var city = cityList[i];
          if (city.toLowerCase() === cityName.toLowerCase()) {
            return;
          }
        }
    }
    cityList.push(cityName);
    addSearchedButtons(cityName);
    searchedcity.val("");
    localStorage.setItem("cityList", JSON.stringify(cityList));
}

//--------------------------------------------------------------------------------------------------

//---------------------------------------- add search History button -------------------------------
//This function adds the searched buttons
function addSearchedButtons(cityName){
    var cityBtn = $("<button>");
    cityBtn.attr("type", "button");
    cityBtn.attr("data-city", cityName);
    cityBtn.addClass("btn form-control mt-2 text-light searched-city-btn");
    cityBtn.text(cityName);
    cityForm.append(cityBtn);
}
//--------------------------------------------------------------------------------------------------

//----------------------------------------- show weather situation----------------------------------
function showWeatherSituation(datePart, weatherObj, isToday){   
    if(isToday){
        var city = $("#city-name");
        var cityText = cityName+" ("+weatherObj.date+") "
        city.text(cityText);
    }
    else{
        var date = $("#"+datePart+"-date");
        date.text(weatherObj.date);
    }
    var temperature = $("#"+datePart+"-temperature");
    temperature.text(weatherObj.temp);
    var wind = $("#"+datePart+"-wind");
    wind.text(weatherObj.wind);
    var humidity = $("#"+datePart+"-humidity");
    humidity.text(weatherObj.humidity);
    var date = $("#"+datePart+"-weather");
}

//--------------------------------------------------------------------------------------------------