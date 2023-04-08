var APIKEY = "64013b468f23baa21fde4b13a3a2c029";


var colWeather = $(".col-weather")
var searchBtn = $("#search-btn");
var searchedcity = $("#searched-city");
var cityName = "";

$(function () {
    refreshPage();
});

//searchWeather();
//------------------------------------------- refresh page -----------------------------------------
function refreshPage(){
    //check if local storage is empty or not
    //if it's Empty, the display of the weather column should be none otherwise block
    colWeather.addClass("invisible"); 
}

//--------------------------------------------------------------------------------------------------


//------------------------------------------- search weather ---------------------------------------
searchBtn.on("click", searchWeather);

function searchWeather(){
    cityName = searchedcity.val();
    if(cityName){
        //get lattitude and longitude
        getGeographicalCoordinates(cityName);
    }
    else{
        alert("A city name should be inserted!")
        showColWeather(false);
    }
}

//--------------------------------------------------------------------------------------------------

//----------------------------------- get Geographical Coordinates ---------------------------------
function getGeographicalCoordinates(cityName) {
    var coordinates=[];
    var apiUrl = "http://api.openweathermap.org/geo/1.0/direct?q="+cityName+"&appid="+ APIKEY;
    fetch(apiUrl).then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
         // displayIssues(data);
         if(data.length === 0){
            alert("The searched city is not found!");
            showColWeather(false);
         }
         else{
            console.log(data[0].lat)
            console.log(data[0].lon)
            coordinates.push(data[0].lat);
            coordinates.push(data[0].lon);
            console.log(coordinates)
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