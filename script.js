$('#failedSearchAlert').hide();

function createCard(data){
    console.log(data);
    
}

function getOneCallData(lat, lon){
    fetch('https://api.openweathermap.org/data/2.5/onecall?lat='+lat+'&lon='+lon+'&exclude=hourly,minutely,alerts&appid=891f7c5d1e00dfea698d456d630ff966')
    .then(function(response){
        return response.json();
    }).then(function(data){
        createCard(data);
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
            getOneCallData(data.coord.lat, data.coord.lon);
        }
    });
}

$('#searchSubmit').on('click', function(event){
    event.preventDefault();
    getWeatherData($('#cityInput').val());
});
