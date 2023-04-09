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

function searchWeather(){
    cityName = searchedcity.val().trim();
    if(cityName){
        //get lattitude and longitude
        getGeographicalCoordinates();
    }
    else{
        alert("A city name should be inserted!")
        showColWeather(false);
    }
}

//--------------------------------------------------------------------------------------------------

//----------------------------------- get Geographical Coordinates ---------------------------------
function getGeographicalCoordinates() {
    var coordinates=[];
    var apiUrl = "http://api.openweathermap.org/geo/1.0/direct?q="+cityName+"&appid="+ APIKEY;
    fetch(apiUrl).then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
        //If the city is not found, the length of data list will be empty
         if(data.length === 0){
            alert("The searched city is not found!");
            searchedcity.val("");
            showColWeather(false);
         }
         else{
            //If city is found, the longitude and 
            coordinates.push(data[0].lat);
            coordinates.push(data[0].lon);
            saveSearchedCity();
            showColWeather(true);
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
          var city = cityList[i].toString();
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