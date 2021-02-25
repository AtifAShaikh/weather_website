$('#failedSearchAlert').hide();

var weatherList = localStorage.getItem('weatherList');
if(weatherList === null){
    localStorage.setItem('weatherList', '[]');
    weatherList = JSON.parse(localStorage.getItem('weatherList'));
}
weatherList = JSON.parse(localStorage.getItem('weatherList'));
console.log(weatherList);

function addCityToWeatherList(cityToAdd){
    if(!weatherList.includes(cityToAdd) && cityToAdd != ''){
        weatherList.push(cityToAdd);
        localStorage.setItem('weatherList', JSON.stringify(weatherList));
        weatherList = JSON.parse(localStorage.getItem('weatherList'));
    }
    
}

function createCard(dataInput){
    // console.log(dataInput);
    var newCard = $('#templateCard').clone();
    $(newCard[0]).removeAttr('id');
    newCard.find('.cityText').text(dataInput.name);
    newCard.find('.weatherConditionText').text(dataInput.weather[0].main);
    newCard.find('.tempText').text(Math.round((((dataInput.main.temp-273.15)*1.8)+32)) + " \xB0" + "F");
    newCard.find('.humidText').text('Humidity: ' + dataInput.main.humidity + "%");
    newCard.find('.windText').text("Wind: " + (Math.round(dataInput.wind.speed*2.24)) + " mph");

    fetch('https://api.openweathermap.org/data/2.5/onecall?lat='+dataInput.coord.lat+'&lon='+dataInput.coord.lon+'&exclude=hourly,minutely,alerts&appid=891f7c5d1e00dfea698d456d630ff966')
    .then(function(response){
        return response.json();
    }).then(function(data){
        // console.log(data);
    });

    // console.log(newCard);
    $('.weatherCardContainer').append(newCard);
}

function getOneCallData(lat, lon){
    fetch('https://api.openweathermap.org/data/2.5/onecall?lat='+lat+'&lon='+lon+'&exclude=hourly,minutely,alerts&appid=891f7c5d1e00dfea698d456d630ff966')
    .then(function(response){
        return response.json();
    }).then(function(data){
        return data.current.uvi;
    });
}

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
            // getOneCallData(data.coord.lat, data.coord.lon);
            addCityToWeatherList($('#cityInput').val());
            createCard(data);
        }
    });
}

$('#searchSubmit').on('click', function(event){
    event.preventDefault();
    getWeatherData($('#cityInput').val());
});

function populateCards(){
    weatherList.forEach(element => {

    fetch("https://api.openweathermap.org/data/2.5/weather?q="+ element +"&appid=891f7c5d1e00dfea698d456d630ff966")
    .then(function(response){
        return response.json();
    }).then(function(data){
        var test = data.cod;
        if(test === "404"){

        } else {
            createCard(data);
        }
    });
    });
}

populateCards();