

var apiKey="ef1738abb13dc5a851688dce2a078c86"
var cityName ;
var currentDate = dayjs().format('dddd, MMMM D, YYYY');
console.log(currentDate);


$("#search-button").on("click", function( event ){
   event.preventDefault();
   if($("#search-input").val() !== "" ){

    cityName = $("#search-input").val();

    console.log("cityname:"+cityName);

    getCurrentWeather();


   }

})




function getCurrentWeather(){

var queryUrl= `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=imperial`;

fetch(queryUrl).then(function(response){
    return response.json();
}).then(function(data){
console.log(data);
var cityEl= $("<h1>");
var divEl=$("<div>");
var p1El=$("<p>");
var p2El=$("<p>");
var p3El=$("<p>");
var weathericon=data.weather[0].icon ;

cityEl.text(`${cityName}-${currentDate}${weathericon} `);
p1El.text(`Humidity: ${data.main.humidity}`);
p2El.text( `Temperature:${data.main.temp}`);
p3El.text(` WindSpeed:${data.wind.speed}`);

$("#today").append(cityEl);
$(divEl).append(p1El);
$(divEl).append(p2El);
$(divEl).append(p3El);
$("#today").append(divEl);



})

}