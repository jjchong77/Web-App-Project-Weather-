$(document).ready(function() { 

    // Client - Server Handler
    $("#userForm").submit(function(event){
        event.preventDefault();

        var user = document.getElementById("user").value;

        $.ajax({
            method: 'post',
            url: '/',
            data: JSON.stringify({ user: user }),
            contentType: 'application/json',

            success: function(data) {
                //console.log(data)
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

    $("#clothingForm").submit(function(event){
        event.preventDefault();
        var type = document.getElementById("type").value;
        var name = document.getElementById("name").value;
        var heat = document.getElementById("heat").value;
        var weather = document.getElementById("weather").value;

        console.log(type + " " + name + " " + heat)

        $.ajax({
            method: 'post',
            url: '/add',
            data: JSON.stringify({ type: type, name: name, heat: heat, weather: weather}),
            contentType: 'application/json',

            success: function(data) {
                //console.log(data)
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

    $("#weatherForm").submit(function(event){
        event.preventDefault();
        var location = document.getElementById("loc").value;
        var temperature = document.getElementById("temp").value;
        var range = document.getElementById("range").value;

        $.ajax({
            method: 'post',
            url: '/weather',
            data: JSON.stringify({ location: location, temperature: temperature, range: range }),
            contentType: 'application/json'
        })
    });

    $("#resultForm").submit(function(event){
        event.preventDefault();
        console.log("resultForm");
        $.ajax({
            method: 'post',
            url: '/result',
            contentType: 'application/json',

            success: function(data) {
                console.log(data)
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
