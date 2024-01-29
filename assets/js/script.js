
/* Sets api key and current date  */
var apiKey="ef1738abb13dc5a851688dce2a078c86"
var cityName ;
var lat;
var lon;
var savedCities=[];
var currentDate = dayjs().format('dddd, MMMM D, YYYY');


/* when submit button is clicked ,displays current weather and 5 day forecast for user city input. */
$("#search-button").on("click", function( event ){
   event.preventDefault();
   
   //localStorage.clear();
   //savedCities = [];
   //$("#history").empty();

   if($("#search-input").val() !== "" ){

    cityName = $("#search-input").val();
      
    getCurrentWeather(cityName);


   }

})



/* Function to display current weather details*/
function getCurrentWeather(cityName){

 $("#today").empty();   

var queryUrl= `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=imperial`;

fetch(queryUrl).then(function(response ){
    checkPast();
    return response.json();
}).then(function(data){

/*Dynamically creates HTML elements to display values in the browser */    
var cityEl= $("<h2>");
var divEl=$("<div>")
var p1El=$("<p>");
var p2El=$("<p>");
var p3El=$("<p>");
var imgEl=$("<img>");


$("#today").css({ 'border': '1px solid #ccc',
    'border-radius': '8px',      
    'padding': '10px',          
    'margin': '10px',           
    'box-shadow': '0 4px 8px rgba(0, 0, 0, 0.1)'})

var weathericon=data.weather[0].icon;
var iconUrl="https://openweathermap.org/img/wn/"+weathericon +"@2x.png";
imgEl.attr("src",iconUrl);
cityEl.text(`${cityName}-${currentDate}`);
cityEl.append(imgEl);
p1El.text(`Humidity: ${data.main.humidity} %`);
p2El.text( `Temperature:${((data.main.temp-32)*5/9).toFixed(2)} °C`);
p3El.text(` WindSpeed:${data.wind.speed} KPH`);

$("#today").append(cityEl);
$(divEl).append(p1El,p2El,p3El);
$("#today").append(divEl);

lat= data.coord.lat;
lon= data.coord.lon;


getfiveday(lat,lon);

})

}

/*Function to display next five day's weather Forecast */

function getfiveday(lat,lon){

 $("#forecast").empty();
var baseUrl= `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`


fetch(baseUrl).then(function(response){
    return response.json();
}).then(function(data){


for(var i=0;i<5;i++){

var date= new Date((data.list[((i+1)*8)-1].dt)*1000).toLocaleDateString();

var temp=data.list[((i+1)*8)-1].main.temp;
var tempC= (temp - 273.15).toFixed(2);
var wind=data.list[((i+1)*8)-1].wind.speed;
var hum=data.list[((i+1)*8)-1].main.humidity;
var iconcode= data.list[((i+1)*8)-1].weather[0].icon;
var iconurl="https://openweathermap.org/img/wn/"+iconcode+".png";
var fDiv= $("<dvi>").attr("class","5day");

fDiv.css({
    'border': '1px solid #ccc',
    'border-radius': '8px',
    'padding': '10px',
    'margin': '10px',
    'width': '150px',
    'background-color': 'rgb(38, 17, 115) ',
     'color': 'white',
    'box-shadow': '0 4px 8px rgba(0, 0, 0, 0.1)'
});

var fh3=$("<h4>").text(date);
var ftemp=$("<p>").text("Temp:" +tempC+ "°C");
var fwind=$("<p>").text("Wind:" +wind+ "%");
var fhum=$("<p>").text("Humidity:" +hum+ "KPH");
var fimg= $("<img src="+iconurl+">");

$("#forecast").append(fDiv);
fDiv.append(fimg,fh3,ftemp,fwind,fhum);


}

})
}

/*Adds new button in the browser based on search history dynamically */

function addCity(){
    var cityBtn=$("<button>");
    cityBtn.attr("type", "button").attr("data-city", cityName).attr("class", "past");
    cityBtn.text(cityName);
    $("#history").append(cityBtn);
    $("#search-input").val("");
}

/* When saved city button is clicked , displays weather details and 5 day forecast for corresponding city*/
$("#history").on("click",".past",function (event) {
    event.preventDefault();
    cityName = $(this).attr("data-city");
    getCurrentWeather(cityName);
  });

  /*Checks user input , if is not in city history , adds the new city to local storage and creates new button */
  function checkPast () {
    if ( $(`#history button[data-city="${cityName}"]`).length ) { 
      $("#search-input").val("");
     
    } else {
      addCity();
      savedCities.push(cityName);
      localStorage.setItem("cities", JSON.stringify(savedCities))
    }
  }

  /*Renders city name from local storage */
  function loadCities() {
    var storedCities = JSON.parse(localStorage.getItem("cities"));
    if (storedCities !== null) {
      savedCities = storedCities;
      renderCities();
    } else {
      cityName = "London"
      checkPast();
    }
  }

  function renderCities() {
    for (var i = 0; i < savedCities.length; i++) {
      cityName = savedCities[i];
      addCity();
    }
  }
  loadCities();
