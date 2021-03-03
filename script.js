// initial variables
var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
$('#failedSearchAlert').hide();
var myCards = [];


// initally accessing local storage
var weatherList = localStorage.getItem('weatherList');
if(weatherList === null){
    localStorage.setItem('weatherList', '[]');
    weatherList = JSON.parse(localStorage.getItem('weatherList'));
}
weatherList = JSON.parse(localStorage.getItem('weatherList'));
console.log(weatherList);


// add new card flow
$('#searchSubmit').on('click', function(event){
    event.preventDefault();
    getWeatherData($('#cityInput').val());
});

function getWeatherData(cityToSearch){
    fetch("https://api.openweathermap.org/data/2.5/weather?q="+ cityToSearch+"&appid=891f7c5d1e00dfea698d456d630ff966")
    .then(function(response){
        return response.json();
    }).then(function(data){
        var test = data.cod;
        if(test === "404"){
            console.log('confirmed');
            $('#failedSearchAlert').show();
        } else {
            $('#searchModal').modal('toggle');
            addCityToWeatherList($('#cityInput').val());
            // once new city is added it leads into the populate cards flow
            populateCards();
        }
    });
}

function addCityToWeatherList(cityToAdd){
    if(!weatherList.includes(cityToAdd) && cityToAdd != ''){
        weatherList.push(cityToAdd);
        localStorage.setItem('weatherList', JSON.stringify(weatherList));
        weatherList = JSON.parse(localStorage.getItem('weatherList'));
    }
}


// populate cards flow
function populateCards(){
    var myCardsIndex = -1;
    myCards = [];
    weatherList.forEach(element => {
        myCardsIndex++;
        myCards.push('');
        getDataForCards(element, myCardsIndex);
    });
}

function getDataForCards(q, indexToPass){
    fetch("https://api.openweathermap.org/data/2.5/weather?q="+ q +"&appid=891f7c5d1e00dfea698d456d630ff966")
    .then(function(response){
        return response.json();
    }).then(function(data){
        var test = data.cod;
        if(test === "404"){

        } else {
            // console.log(indexToPass);
            createCard(data, indexToPass);
        }
    });
}

function createCard(dataInput, myIndex){
    // console.log(dataInput);
    var myI = myIndex;
    var newCard = $('#templateCard').clone();
    $(newCard[0]).removeAttr('id');
    newCard.find('.cityText').text(dataInput.name);
    newCard.find('.weatherConditionText').text(dataInput.weather[0].main);
    newCard.find('.tempText').text(Math.round((((dataInput.main.temp-273.15)*1.8)+32)) + " \xB0" + "F");
    newCard.find('.humidText').text('Humidity: ' + dataInput.main.humidity + "%");
    newCard.find('.windText').text("Wind: " + (Math.round(dataInput.wind.speed*2.24)) + " mph");
    newCard.find('.todaysWeather').attr('src', './WeatherImages/' + dataInput.weather[0].icon + '.png');

    fetch('https://api.openweathermap.org/data/2.5/onecall?lat='+dataInput.coord.lat+'&lon='+dataInput.coord.lon+'&exclude=hourly,minutely,alerts&appid=891f7c5d1e00dfea698d456d630ff966')
    .then(function(response){
        return response.json();
    }).then(function(data){
        console.log(data);
        newCard.find('.UVText').text('UVI: ' + data.current.uvi);
        var currentDay = new Date();
        for(var i = 1; i<6; i++){
            currentDay.setTime(data.daily[i].dt * 1000);
            newCard.find('.day' + i).find('h6').text(days[currentDay.getDay()]);
            newCard.find('.day' + i).find('h5').text(Math.round((((data.daily[i].temp.day-273.15)*1.8)+32)) + " \xB0" + "F");
            newCard.find('.day'+ i).find('img').attr('src', './WeatherImages/' + data.daily[i].weather[0].icon + '.png');
        }
        myCards[myI] = newCard;
        appendCards(myCards);
    });   
}

function appendCards(cardsToAppend){
    // console.log(cardsToAppend);
    $('.weatherCardContainer').empty();
    cardsToAppend.forEach(element => {
        $('.weatherCardContainer').append(element);
    });
}

populateCards();

$(document).ready(function(){
    $('.weatherCardContainer').sortable();
});