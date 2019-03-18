$(document).ready(function() { 

    const socket = new WebSocket('ws://localhost:8080');
    var d = $(document.createElement('input'));

    $("#goButton").on('click', function() {
        var location = document.getElementById("loc").value;
        var temp = document.getElementById("temp").value;
        var range = document.getElementById("range").value;

        socket.addEventListener('open', function (event) {
            socket.send(location + "#" + temp + "#" + range);
        });
    });

    // Listen for messages
    socket.addEventListener('message', function (event) {
        console.log('Message from server ', event.data);
        
        var weather="sunny";
        var accessory="scarf";
        var top="jacket";
        var bottom="skirt";
        var endstring="It is " + weather + ". You should take "+ accessory +". You should wear a "+ top + " and a " + bottom + ".";

        $("#result").append("<p>" + endstring + "</p>")
    });
});

/*
function calculate(location, comfort_temperature, range)
{
    //use location to get data
    //comfort temperature will be the temperature user wants to feel
    int baseline=comfort_temperature+ feel_temperature; //baseline variable will equal "how it feels outside" + goal temperature.
    int min=comfort_temperature-range;
    int max=comfort_temperature+range; //min and max are within X degrees  of comfort temperature

    final_result=null; //set variable for final result;

    top =[];//put all type:top items into array
    bot =[];//put all type:bot items into array

    access=[]; //put all accessories into arrays
    outA=null; //assign variable for accessory chosen


    for (a in access) //for all accessories
    {
        c=a.code; //referring to weather code in API - sunny, cloudy, etc.
        if (code==1000) //1000 is code for sunny
        {
            outA=sunglasses;
        }
        else if (code==1063||1072)//two rain codes
        {
            outA=umbrella;
        }
        else if (code => 1150 && code <=1201)//range of rain codes
        {
            outA=umbrella;
        }
        else if (code => 1240 && code <=1246) //more rain codes
        {
            outA=umbrella;
        }

        else if (code => 1273 && code <=1282) //last set of rain codes
        {
            outA=umbrella;
        }

        else if (code ==1066||code==114||code==117) //indivdual snow codes
        {
            outA=scarf;
        }

        else if (code => 1210 && code <=1237) //range of snow codes
        {
            outA=scarf;
        }

        else if (code => 1249 && code <=1264) //range of snow codes
        {
            outA=scarf;
        }
        //basically, check if the "code" is the code for Sunny, or one of the codes that indicate snow or rain.
        //if it is, set the accessory to sunglasses/umbrella/scarf.

        else {
            outA=bag;
        }
        //if it wasn't one of the pre-set codes, then set it to bag, which will be the default accessory.
    }


    possibilities=[]; //this array will contain the options that fit the requirements.
    for (t in top) // go through every top item, using t as the variable. E.g: T is t-shirt in the first loop, long-sleeve in the second...
    {
        for (b in bot) // do the same for every bot item
        {
            int effectiveheat=t.heat+b.heat+outA.heat+feel_temperature;
            //Start with temperature it feels outside.
            //By adding the heat value of chosen accessory, bot, and top  to this, we can calculate the effective heat of each combination.
            //ex: if i want to feel 20 degrees, and it's -15 degrees outside.
            // I should wear a heat value of 35.
            //the closest would be scarf (chosen earlier) =5 + heavy coat=14 + snowpants=20
            //5+14+20-15=24
            // this is the effective heat, considering the temperature it feels like, and the heat from everything worn.

            if (effectiveheat=> min && effectiveheat<=max) //if the combination is within the range
            { //in this case, 24 is 10 degrees within the desired temperature of 20
                delta=absolutevalue(t.heat-b.heat); //calculate absolute difference between items
                possibilities.append([outA, t, b, delta])// add an array containing outA t, b, and delta to the possibilities array;
            }
        }

        if (possibilities.length==0)
        { //if there are no possibiliites found
            if (feel_temperature>0)  //if it's hot
            {
                possibilities.append([outA, tshirt, shorts, 2]); //manually add coolest combination
            }
            else // if its cold
            {
                possibilities.append([outA, heavy coat, snow pants,6]) //manually add hottest combination
            }
        }
    }
    //after this, all possible combination of tops and bottoms have been iterated through, calculating the effective heat.
    //
    final_result=possibilities[0]; //set to first possible set by default;
    //final result is now an array containing [top, bottom, delta]
    if (possibilities.length<0)
    {
        for (int i =0; i<possibilities.length; i++)
        {
            //go through the possibilities array
            if (final_result[2]<possibilities[i][2]) //if the delta inside final result is smaller than the delta of possibilities[i]
            {
                final_result=possibilities[i]; //set final result to possibilities[i]
            }
        }
    }
    //after this, final_result should be the array in possibilities with the SMALLEST delta.
    return final_result;
    //returns a single array of [outA, top, bot, delta]. OutA is the accessory appropriate for the weather.
    //top and bot are an arbitrary combination of items with the appropriate heat, optimized to be the closest items that
    //produce an acceptable heat value.
}
*/