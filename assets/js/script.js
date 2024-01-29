

var apiKey="ef1738abb13dc5a851688dce2a078c86"
var cityName ;
var lat;
var lon;
var savedCities=[];
var currentDate = dayjs().format('dddd, MMMM D, YYYY');
console.log(currentDate);


$("#search-button").on("click", function( event ){
   event.preventDefault();
   
   //localStorage.clear();
   //savedCities = [];
   //$("#history").empty();

   if($("#search-input").val() !== "" ){

    cityName = $("#search-input").val();

    console.log("cityname:"+cityName);

    
    getCurrentWeather(cityName);


   }

})




function getCurrentWeather(cityName){

 $("#today").empty();   

var queryUrl= `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=imperial`;

fetch(queryUrl).then(function(response ){
    checkPast();
    return response.json();
}).then(function(data){
console.log(data);
var cityEl= $("<h1>");
var divEl=$("<div>")
var p1El=$("<p>");
var p2El=$("<p>");
var p3El=$("<p>");
var imgEl=$("<img>");

var weathericon=data.weather[0].icon;
var iconUrl="https://openweathermap.org/img/wn/"+weathericon +"@2x.png";
imgEl.attr("src",iconUrl);
cityEl.text(`${cityName}-${currentDate}`);
cityEl.append(imgEl);
p1El.text(`Humidity: ${data.main.humidity} KPH`);
p2El.text( `Temperature:${((data.main.temp-32)*5/9).toFixed(2)} °C`);
p3El.text(` WindSpeed:${data.wind.speed} %`);

$("#today").append(cityEl);
$(divEl).append(p1El,p2El,p3El);
$("#today").append(divEl);

lat= data.coord.lat;
console.log(lat);
lon= data.coord.lon;
console.log(lon);

getfiveday(lat,lon);

})

}

function getfiveday(lat,lon){

    $("#forecast").empty();
var baseUrl= `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`


console.log(baseUrl);
fetch(baseUrl).then(function(response){
    return response.json();
}).then(function(data){
console.log(data);

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
    'background-color': 'blueviolet',
     'color': 'white',
    'box-shadow': '0 4px 8px rgba(0, 0, 0, 0.1)'
});

var fh3=$("<h3>").text(date);
var ftemp=$("<p>").text(tempC+ "°C");
var fwind=$("<p>").text(wind+ "KPH");
var fhum=$("<p>").text(hum+ "%");
var fimg= $("<img src="+iconurl+">");

$("#forecast").append(fDiv);
fDiv.append(fimg,fh3,ftemp,fwind,fhum);

console.log(date);
console.log(temp);
console.log(wind);
console.log(hum);

}

})
}

function addCity(){
    var cityBtn=$("<button>");
    cityBtn.attr("type", "button").attr("data-city", cityName).attr("class", "past");
    cityBtn.text(cityName);
    $("#history").append(cityBtn);
    $("#search-input").val("");
}

$("#history").on("click",".past",function (event) {
    event.preventDefault();
    cityName = $(this).attr("data-city");
    getCurrentWeather(cityName);
  });

  function checkPast () {
    if ( $(`#history button[data-city="${cityName}"]`).length ) { 
      $("#search-input").val("");
     
    } else {
      addCity();
      savedCities.push(cityName);
      localStorage.setItem("cities", JSON.stringify(savedCities))
    }
  }

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
