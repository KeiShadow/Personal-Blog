//globalni promenne
var term = document.getElementById("#form");
var url = "https://api.skypicker.com/places?locale=cs";

console.log(url);

var options = "";
var latitude = new Array();
var longitude = new Array();
var places = new Array();
var locations = new Array();

var concat = new Array();
var concatTo = new Array();
var concatFrom = new Array();


var NameRoute = new Array();
var notDuplicates = new Array();
var urlFlights = "";
var flightFrom;
var flightTo;
var flightPath;

var dateFrom;
var dateTo;

var map;
var route = new Array();

var id = 0;
var path = "";
var neco = "";
var tem = false;
var lineSymbol;

$(document).ready(function () {

    getPlaces(url);

    setDate();

    $(window).load(function () {
        initMap();
    });
});






//Google map inicializace mapy
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 7,
        center: new google.maps.LatLng(50.088, 14.4208),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    var infowindow = new google.maps.InfoWindow({});

    var marker, i;
    var markers = new Array();

    lineSymbol = {
        path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
        scale: 8,
        strokeColor: '#125'
    };

    markers = locations.map(function (location, i) {
        marker = new google.maps.Marker({
            position: locations[i],
            icon: 'img/aeroplane.png'
        });

        google.maps.event.addListener(marker, 'click', (function (marker, i) {
            return function () {
                infowindow.setContent(places[i]);
                infowindow.open(map, marker);

                if ($("#srchFrom").val() == '') {
                    $("#srchFrom").val(places[i]);
                } else {
                    $("#srchTo").val(places[i]);
                }
            }
        })(marker, i));
        return marker;
    });

    var markerCluster = new MarkerClusterer(map, markers,
        { imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m' });
        markerCluster.setMap(map);

}

function validateForm() {
    var srchFrom = document.forms["myForm"]["srchFrom"].value;
    var srchTo = document.forms["myForm"]["srchTo"].value;
    var dateFrom = document.forms["myForm"]["departure"].value;
    if (srchFrom == "" || srchTo == "") {
        alert("Pole Odkud letíte nebo Kam letíte není vyplněno");
        location.reload(true);
        return false;

    } else if (dateFrom == "") {

        alert("Prosím vyplňte datum odletu.");
        location.reload(true);
        return false;
    } else {
        return true;
    }

}

function getFlightRoute() {
    flightPath = new google.maps.Polyline({
        path: concat,
        icons: [{
            icon: lineSymbol,
            offset: '100%'
        }],
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
    });

    return flightPath;

}

function animateCircle(line) {
    var count = 0;
    window.setInterval(function () {
        count = (count + 1) % 200;
        var icons = line.get('icons');
        icons[0].offset = (count / 2) + '%';
        line.set('icons', icons);
    }, 20);
}
/**
 * Funkce která nastaví na mapě trajektorii letu.
 */
function setTrack() {
    getFlightRoute();
    animateCircle(flightPath);
    flightPath.setMap(map);
}
function clearTrack() {
    flightPath.setMap(null);
}
/**
 * Funkce pomocí které může uživatel nastavit datum odletu a příletu.
 * Datum návratu nemusí být vyplněno
 */
function setDate() {
    // Datum
    var dates = $("#departure, #return").datepicker({
        defaultDate: "+2w",
        changeMonth: true,
        numberOfMonths: 2,
        dateFormat: 'd/mm/yy',
        onSelect: function (selectedDate) {
            var option = this.id === "departure" ? "minDate" : "maxDate",
                instance = $(this).data("datepicker");
            date = $.datepicker.parseDate(
                instance.settings.dateFormat ||
                $.datepicker._defaults.dateFormat,
                selectedDate, instance.settings);
            dates.not(this).datepicker("option", option, date);

            console.log($("#departure").datepicker().val());
        }
    });
}
/**
 * Funkce která, vyplní inputy na html stránce, pro interakci s uživatelem.
 * Stačí zadat název místa odletu, automatikcy nabídne místa odletu.
 */
function getPlaces(url) {
    $.ajax({
        type: "GET",
        url: url,
        success: function (success) {
            options = "";
            var uniqueArray = success.filter(function (elem, pos) {
                return success.indexOf(elem) === pos;
            });
            for (var i = 0; i < success.length; i++) {
                if (success[i].id.length > 3) {
                    options += '<option data-id="' + uniqueArray[i].id + '" value="' + uniqueArray[i].value + '" >' + uniqueArray[i].value + '</option>';
                }
            }
            setCoord(success);
            setPlaces(success);
            document.getElementById('datalistFrom').innerHTML = options;
            document.getElementById('datalistTo').innerHTML = options;
        },
        dataType: "json"//set to JSON    
    });
}

/**
 * 
 * @param {* pole} response 
 */
function setCoord(success) {
    for (var i = 0; i < success.length; i++) {
        if (success[i]["lat"] != null && success[i]["lng"] != null) {
            if (success[i].type == 2) {
                locations[i] = { lat: success[i]["lat"], lng: success[i]["lng"] };
            }
        }
    }
}

function setPlaces(success) {
    for (var i = 0; i < success.length; i++) {
        if (success[i].id.length > 3) {
            places[i] = success[i].value;
        }

    }
}
/**
 * Funkce která pomocí ajaxu get naplní pole ze souboru typu JSON
 * Toto pole se poté používá jako hlavní pole, pro výpisy
 */
function getFlights() {

    //clearTrack();
    document.getElementById("lety").innerHTML = "";
    delete notDuplicates;
    delete locations;
    urlFlights = "";
    flightFrom = $("#datalistFrom option[value='" + $('#srchFrom').val() + "']").attr('data-id');
    flightTo = $("#datalistFrom option[value='" + $('#srchTo').val() + "']").attr('data-id');
    dateFrom = $("#departure").datepicker().val();
    dateTo = $("#return").datepicker().val();


    if (dateTo === "") {
        urlFlights = "https://api.skypicker.com/flights?flyFrom=" + flightFrom + "&to=" + flightTo + "&dateFrom=" + dateFrom + "&locale=cz&curr=CZK&sort=price";
    } else {
        urlFlights = "https://api.skypicker.com/flights?flyFrom=" + flightFrom + "&to=" + flightTo + "&returnFrom=" + dateFrom + "&returnTo=" + dateTo + "&locale=cz&curr=CZK&sort=price";
    }
    $.ajax({
        type: "GET",
        url: urlFlights,
        success: function (response) {
            for (var i = 0; i < response["data"].length; i++) {
                if (response["data"][i].cityFrom != response["data"][i].cityTo) {
                    notDuplicates[i] = response["data"][i];
                }
            }
            notDuplicates = $.grep(notDuplicates, function (n) { return n === 0 || n });
            viewCardFlight(notDuplicates);
            route = getResponse(notDuplicates);
        },
        dataType: "json"//set to JSON    
    });


}
/*
 * Funkce která vypíše lety podle vstupu uživatele
 */
function viewCardFlight(notDuplicates) {
    path = "";
    for (var i = 0; i < notDuplicates.length; i++) {
        path += "<div class=\"card\">" +
            "<a name=\"clickFlight\" href=\"#collapse" + i + "\" data-toggle=\"collapse\" id=\"no_" + i + "\" onclick=\"setRoutes(" + i + ")\" class=\"btn\"><div class=\"card-body\">" +
            "<div class=\"row\">" +
            "<div class=\"col-sm-3\" >" +
            " <div class=\"text-left\" id=\"spolecnost\">" +
            " <p class=\"lead\"> Společnosti: </p><br> " + getAirlines(notDuplicates, i) +
            " </div> " +
            " </div >" +
            "<div class=\"col-sm-3\">" +
            getFromTo(notDuplicates, i) +
            "</div>" +
            "<div class=\"col-sm-3\">" +
            getDuration(notDuplicates, i) +
            "</div>" +
            "<div class=\"col-sm-3\">" +
            getPrice(notDuplicates, i) + " Kč. <br/>" +
            "</div>" +
            " </div >" +
            "</div></a>" +
            "<div id=\"collapse" + i + "\" class=\" collapse\">" +
            "<hr><div class=\"card-block\">Doba cesty Tam: " + toHHMMSS(getDeparture(notDuplicates, i)) +
            "<br> Cesta: <br>" + Prestupy(notDuplicates, i) +
            "</div>" +
            "</div>" +
            "</div>";
    }
    document.getElementById("lety").innerHTML = path;
}

/**
 * 
 * @param {*Hlavní pole} notDuplicates 
 * @param {* identifikační číslo letu, používá se pro identifikaci při kliku na list na stránce} i 
 */
function Prestupy(notDuplicates, i) {
    neco = "";

    for (var x = 0; x < notDuplicates[i]["route"].length; x++) {
        if (notDuplicates[i]["route"][x].cityFrom != notDuplicates[i]["cityTo"]) {
            neco += "<div class=\"col\"> <ul class=\"list-group\"> <li class=\"list-group-item\"> " +
                convertTime(notDuplicates[i]["route"][x].dTime) + ": " +
                notDuplicates[i]["route"][x].cityFrom + "<br> " +
                convertTime(notDuplicates[i]["route"][x].aTime) + ": " +
                notDuplicates[i]["route"][x].cityTo +
                "</li></ul><br></div>";
        } else {
            neco += "<div class=\"col\">Doba cesty zpět: " + toHHMMSS(getReturn(notDuplicates, i)) + "<br>Zpáteční cesta:   <ul class=\"list-group\"> <li class=\"list-group-item\"> " +
                convertTime(notDuplicates[i]["route"][x].dTime) + ": " +
                notDuplicates[i]["route"][x].cityFrom + "<br> " +
                convertTime(notDuplicates[i]["route"][x].aTime) + ": " +
                notDuplicates[i]["route"][x].cityTo +
                "</li></ul><br></div>";
        }
    }
    return neco;
}


function getResponse(notDuplicates) {
    return notDuplicates;
}

/**
 * 
 * @param {*identifikační číslo, pro naplnění souřadnicí letu} i 
 */
function setRoutes(i) {

    $("#collapse" + i).on('show.bs.collapse', function () {
        tem = true;
        for (var j = 0; j < notDuplicates[i]["route"].length; j++) {
            concat[j] = { name: notDuplicates[i]["route"][j]["cityFrom"], "lat": notDuplicates[i]["route"][j]["latFrom"], "lng": notDuplicates[i]["route"][j]["lngFrom"] };
            concat[j + 1] = { name: notDuplicates[i]["route"][j]["cityTo"], "lat": notDuplicates[i]["route"][j]["latTo"], "lng": notDuplicates[i]["route"][j]["lngTo"] };
        }
        concat = $.grep(concat, function (n) { return n === 0 || n });
        console.log(concat);
        setTrack();
    })
    $("#collapse" + i).on('hidden.bs.collapse', function () {
        concat = new Array();
        clearTrack();
    })




}

/**
 * 
 * @param {*Parametr z jsonu pro převod data a času} timestamp 
 */
function convertTime(timestamp) {
    return moment.unix(timestamp).format("DD/MM/YYYY HH:MM");
}

var obj = $.getJSON("js/airlines.json", function (data) {
    return data;
});
/**
 * 
 * @param {*Převod času, z json souboru} sec 
 */
function toHHMMSS(sec) {
    var sec_num = parseInt(sec, 10); // don't forget the second param
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);


    if (hours < 10) { hours = "0" + hours; }
    if (minutes < 10) { minutes = "0" + minutes; }

    return hours + 'h:' + minutes + 'm';
}

/**
 * Funkce která vrací společnosti u daného letu
 * @param {*Hlavní pole} notDuplicates 
 * @param {* identifikační číslo kliknuté položky} i 
 */
function getAirlines(notDuplicates, i) {
    var airlines = "";
    if (notDuplicates[i]["airlines"].length >= 2) {
        for (var y = 0; y < obj["responseJSON"].length; y++) {
            for (var j = 0; j < notDuplicates[i]["airlines"].length; j++) {
                if (notDuplicates[i]["airlines"][j] === obj["responseJSON"][y].id) {
                    airlines += obj["responseJSON"][y].name + " <br>";
                }
            }

        }
        //airlines = airlines.substring(0, airlines.lastIndexOf(" "));
        return airlines;
    } else {

        for (var y = 0; y < obj["responseJSON"].length; y++) {
            for (var j = 0; j < notDuplicates[i]["airlines"].length; j++) {
                if (notDuplicates[i]["airlines"][j] === obj["responseJSON"][y].id) {
                    return obj["responseJSON"][y].name;
                }
            }
        }
    }
}
//Odlet
function getDeparture(notDuplicates, i) {
    return notDuplicates[i]["duration"].departure;
}
//Přílet
function getReturn(notDuplicates, i) {
    return notDuplicates[i]["duration"].return;
}

function getFromTo(notDuplicates, i) {
    var pom = "";
    for (var x = 0; x < notDuplicates[i]["route"].length; x++) {
        if (notDuplicates[i].cityFrom != notDuplicates[i]["route"][x].cityTo) {
            pom = notDuplicates[i]["cityFrom"] + " - " +
                notDuplicates[i]["cityTo"] + "<br> <p class=\" blockquote-footer\">" +
                convertTime(notDuplicates[i]["dTime"]) + "</p>";
        } else {
            pom += notDuplicates[i]["cityTo"] + " - " +
                notDuplicates[i]["cityFrom"] + "<br> <p class=\" blockquote-footer\">" +
                convertTime(notDuplicates[i]["route"][x]["dTime"]) + "</p>";
        }
    }
    return pom;
}

function getDuration(notDuplicates, i) {
    return toHHMMSS(notDuplicates[i]["duration"].total);
}
function getPrice(notDuplicates, i) {
    return notDuplicates[i]["price"];
}