$(document).ready(function() { 

    // Client - Server Handler
    // Set Database name
    $("#userForm").submit(function(event){
        event.preventDefault();

        var user = document.getElementById("user").value;

        $.ajax({
            method: 'post',
            url: '/',
            data: JSON.stringify({ user: user }),
            contentType: 'application/json',

            success: function(data) {
                if (data.constructor === Array) {
                    $("#wardrobe").html("<tr></tr>");
                    $.each(data, function(index, element) {
                        $("#wardrobe tr:last").after("<tr> <td>" + element.type + "</td><td>" + element.name + "</td><td>" + element.heat + "</td><td>" + element.weather + "</td></tr>");
                    });
                } else {
                    $("#warning").html("Something Went Wrong!");
                }
            }
        })
    });

    // Add to Database
    $("#clothingForm").submit(function(event){
        event.preventDefault();
        var type = document.getElementById("type").value;
        var name = document.getElementById("name").value;
        var heat = document.getElementById("heat").value;
        var weather = document.getElementById("weather").value;

        $.ajax({
            method: 'post',
            url: '/add',
            data: JSON.stringify({ type: type, name: name, heat: heat, weather: weather}),
            contentType: 'application/json',

            success: function(data) {
                if (data.constructor === Array) {
                    $("#wardrobe").html("<tr></tr>");
                    $.each(data, function(index, element) {
                        $("#wardrobe tr:last").after("<tr> <td>" + element.type + "</td><td>" + element.name + "</td><td>" + element.heat + "</td><td>" + element.weather + "</td></tr>");
                    });
                } else {
                    $("#warning").html("Something Went Wrong!");
                }
            }
        });
    });

    // Submit parameters
    $("#weatherForm").submit(function(event){
        event.preventDefault();
        var location = document.getElementById("loc").value;
        var temperature = document.getElementById("temp").value;
        var range = document.getElementById("range").value;

        $.ajax({
            method: 'post',
            url: '/weather',
            data: JSON.stringify({ location: location, temperature: temperature, range: range }),
            contentType: 'application/json',

            success: function(data) {
                if (data.constructor == Object) {
                    $("#forecast").html("");
                    
                    var forecast = data.forecast.forecastday;
                    $("#forecast").append("<h2>Forecast: </h2>");
                    $("#forecast").append("<table class = table><tr><th>Date</th><th>Condition</th><th>High</th><th>Low</th><th>Wind</th><th>Outlook</th></tr></table>");

                    $.each(forecast, function(index, element) {

                        $("#forecast tr:last").after("<tr><td>" + element.date + "</td><td id = image" + index + "></td><td>" + element.day.maxtemp_c + " C</td><td>" + element.day.mintemp_c + " C</td><td>" + element.day.maxwind_kph + " km/h</td><td>" + element.day.condition.text +"</td></tr>");

                        var path = "http:" + element.day.condition.icon;
                        var target = "#image" + index;
                        $(target).prepend('<img src= "' + path + '"/>')

                    });
                } else {
                    $("#forecast").html("Something Went Wrong!");
                }
            }
        })

    });

    // Get Result
    $("#resultForm").submit(function(event){
        event.preventDefault();
        $.ajax({
            method: 'post',
            url: '/result',
            contentType: 'application/json',

            success: function(data) {
                if (data.constructor == Object) {
                    $("#top").html(data.top);
                    $("#bot").html(data.bot);
                    $("#acc").html(data.acc);
                } else {
                    $("#warning").html(data);
                }
            }
        })
    });

    // Delete Database
    $("#deleteForm").submit(function(event){
        event.preventDefault();

        $.ajax({
            method: 'post',
            url: '/result/delete',
            contentType: 'application/json',


            success: function(data) {
                $("#warning").html(data);
            }
        });
    });
});
