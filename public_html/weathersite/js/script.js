
var urlOnce = 'http://api.openweathermap.org/data/2.5/weather?q=Ostrava&units=metric&lang=en&appid=abcb921ca7be6867b0b964ece67ac025';
var forecastDaily = 'http://api.openweathermap.org/data/2.5/forecast/daily?q=Ostrava&units=metric&lang=en&cnt=7&appid=abcb921ca7be6867b0b964ece67ac025';


var locations = new Array();
var places = new Array();
$(document).ready(function () {
    getPlaces();
    getWeatherToday();   

    $(window).load(function () {
        initMap();
    });
});

function initMap() {
    
   var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 7,
        center: new google.maps.LatLng(50.088, 14.4208),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    var infowindow = new google.maps.InfoWindow();
    
    var marker, i, image;

    image = {
        url: 'svgs/sun.svg',
        scaledSize: new google.maps.Size(28, 28), // scaled size
        origin: new google.maps.Point(10,10), // origin
        anchor: new google.maps.Point(25,25),
      };    

    for( i=0; i<locations.length;i++){
     

        marker = new google.maps.Marker({
            position: new google.maps.LatLng(locations[i].lat, locations[i].lng),
           
            map: map
     });
    

    google.maps.event.addListener(marker, 'click', (function(marker, i) {
        return function() {
          infowindow.setContent(places[i].name);
          infowindow.open(map, marker);
          $("#srchCity").val(places[i].name);
        }
      })(marker, i));
    
    }
  }

var alertTheSelectedValue = function() {
    var val = document.getElementById('srchCity').value;
    var text = $('#listOfCities').find('option[value="' + val + '"]').attr('id');
   // getWeatherToday("http://api.openweathermap.org/data/2.5/weather?q=" + data['data'][id]['name'] + "&units=metric&lang=en&appid=abcb921ca7be6867b0b964ece67ac025");
    console.log(data['data']);
    //alert(text);
  }

  
function Empty() {
    $('.city').empty();
    $('#svg').empty();
    $('.temp').empty();
    $('.max-temp').empty();
    $('.desc').empty();
    $('.humid').empty();
    $('.wind-speed').empty();
    $('.sunrise').empty();
    $('.sunset').empty();
   

}

function getWeatherToday() {
    //urlOnce = 'http://api.openweathermap.org/data/2.5/weather?q=Ostrava&units=metric&lang=en&appid=abcb921ca7be6867b0b964ece67ac025';
   var srchCity= $("#srchCity").val();
    if(srchCity == ""){
        urlOnce = 'http://api.openweathermap.org/data/2.5/weather?q=Ostrava&units=metric&lang=en&appid=abcb921ca7be6867b0b964ece67ac025'; 
    }else{
        var srchCityDatalist = $("#listOfCities option[value='" + $('#srchCity').val() + "']").attr('value');
        urlOnce = 'http://api.openweathermap.org/data/2.5/weather?q='+srchCityDatalist+'&units=metric&lang=en&appid=abcb921ca7be6867b0b964ece67ac025'; 
    }
    console.log(srchCity);
    Empty();
    $.ajax({
        type: "GET",
        url: urlOnce,
        dataType: "jsonp",
        crossDomain: true,
        success: function (response) {
            // console.log(response);

            var SunriseSec = response["sys"].sunrise;
            var SunriseDate = new Date(SunriseSec * 1000);
            var Vychod = SunriseDate.toLocaleTimeString();
            var VychodH = SunriseDate.getHours();
            var VychodM = SunriseDate.getMinutes();

            var SunsetSec = response["sys"].sunset;
            var SunsetDate = new Date(SunsetSec * 1000);
            var Zapad = SunsetDate.toLocaleTimeString();
            var ZapadH = SunsetDate.getHours();
            var ZapadM = SunsetDate.getMinutes();

            function pad(d) {
                return (d < 10) ? '0' + d.toString() : d.toString();
            }

            document.getElementById('city').innerHTML = response.name;
            document.getElementById('temp').innerHTML = Math.round(response["main"].temp) + "°";
            document.getElementById('max-temp').innerHTML = response["main"].temp_max + "°";
            document.getElementById('humid').innerHTML = response["main"].humidity + "%";
            document.getElementById('wind-speed').innerHTML = response["wind"].speed + "m/s";
            document.getElementById('sunrise').innerHTML = VychodH + ":" + pad(VychodM);
            document.getElementById('sunset').innerHTML = ZapadH + ":" + pad(ZapadM);
            document.getElementById('desc').innerHTML = response["weather"][0].description;
          
            

            getSVG(response["weather"][0].id, VychodH, ZapadH);
        }
    });
 
}

function getPlaces() {
    var options = "";
   
     $.getJSON('city/cities.json', function (data) {
         console.log(data);
        
        for (var i = 0; i < data.length; i++) {
                options += '<option data-id="' + data[i].id + '" value="' + data[i].name + '" >' + data[i].name + '</option>';
        }

        setCoordAPlaces(data); 
         document.getElementById('listOfCities').innerHTML = options;   
});
    
}

function setCoordAPlaces(data){
        for (var i = 0; i < data.length; i++) {
            if (data[i]["lat"] != null && data[i]["lon"] != null) {
                    locations[i] = { lat: data[i]["lat"], lng: data[i]["lon"] };
                    places[i] = {name: data[i].name};
            }
        }
        console.log(locations);
}

/*Media*/
function getSVG(id, VychodH, ZapadH) {
    var time = new Date();
    /*noc*/
    if (time.getHours() > ZapadH) {
        if (id >= 200 && id <= 232) {
            /*$('#svg').append(
                "<object data=\"svgs/cloudLightningMoon.svg\" type=\"image/svg+xml\">\n\
                <img src=\"svgs/cloudLightningMoon.svg\" />\n\
               </object> ");*/
        } else if (id >= 300 && id <= 321) {
            $('#svg').append(     
                "<object data=\"svgs/cloudDrizzleMoon.svg\" type=\"image/svg+xml\">\n\
                <img src=\"svgs/cloudDrizzleMoon.svg\" />\n\
               </object> ");
        } else if (id >= 500 && id <= 531) {
            $('#svg').append(
                "<object data=\"svgs/cloudRainMoon.svg\" type=\"image/svg+xml\">\n\
                <img src=\"svgs/cloudRainMoon.svg\" />\n\
               </object> ");
        } else if (id >= 600 && id <= 622) {
            $('#svg').append(
                "<object data=\"svgs/cloudSnowMoon.svg\" type=\"image/svg+xml\">\n\
                <img src=\"svgs/cloudSnowMoon.svg\" />\n\
               </object> ");
        } else if (id >= 701 && id <= 781) {
            $('#svg').append(
                "<object data=\"svgs/cloudFogMoon.svg\" type=\"image/svg+xml\">\n\
                <img src=\"svgs/cloudFogMoon.svg\" />\n\
               </object> ");
        } else if (id === 800) {
            $('#svg').append(
                "<object data=\"svgs/moon.svg\" type=\"image/svg+xml\">\n\
                <img src=\"svgs/moon.svg\" />\n\
               </object> ");
        } else if (id >= 801 && id <= 804) {
            $('#svg').append(
                "<object data=\"svgs/cloudMoon.svg\" type=\"image/svg+xml\">\n\
                <img src=\"svgs/cloudMoon.svg\" />\n\
               </object> ");
        }
    }
    /*Den*/
    else if (time.getHours() > VychodH) {
        if (id >= 200 && id <= 232) {
            $('#svg').append(
                "<object data=\"svgs/cloudLightningSun.svg\" type=\"image/svg+xml\">\n\
                <img src=\"svgs/cloudLightningSun.svg\" />\n\
               </object> ");
        } else if (id >= 300 && id <= 321) {
            $('#svg').append(
                "<object data=\"svgs/cloudDrizzleSun.svg\" type=\"image/svg+xml\">\n\
                <img src=\"svgs/cloudDrizzleSun.svg\" />\n\
               </object> ");
        } else if (id >= 500 && id <= 531) {
            $('#svg').append(
                "<object data=\"svgs/cloudRainSun.svg\" type=\"image/svg+xml\">\n\
                <img src=\"svgs/cloudRainSun.svg\" />\n\
               </object> ");
        } else if (id >= 600 && id <= 622) {
            $('#svg').append(
                "<object data=\"svgs/cloudSnowSun.svg\" type=\"image/svg+xml\">\n\
                <img src=\"svgs/cloudSnowSun.svg\" />\n\
               </object> ");
        } else if (id >= 701 && id <= 781) {
            $('#svg').append(
                "<object data=\"svgs/cloudFogSun.svg\" type=\"image/svg+xml\">\n\
                <img src=\"svgs/cloudFogSun.svg\" />\n\
               </object> ");
        } else if (id === 800) {
            $('#svg').append(
                "<object data=\"svgs/sun.svg\" type=\"image/svg+xml\">\n\
                <img src=\"svgs/sun.svg\" />\n\
               </object> ");
        } else if (id >= 801 && id <= 804) {
            $('#svg').append(
                "<object data=\"svgs/cloudSun.svg\" type=\"image/svg+xml\">\n\
                <img src=\"svgs/cloudSun.svg\" />\n\
               </object> ");
        }

    }
}
/*
function getClimacon(id){
    if (id >= 200 && id <= 232) {
           return 'lighting';
         } else if (id >= 300 && id <= 321) {
            return 'drizzle'; 
         } else if (id >= 500 && id <= 531) {
            return 'rain';
         } else if (id >= 600 && id <= 622) {
            return 'snow';
         } else if (id >= 701 && id <= 781) {
            return 'fog';
         } else if (id === 800) {
            return 'sun';
         } else if (id >= 801 && id <= 804) {
             return 'cloud';
         }
         else if (id >= 901 && id <= 806) {
             return 'tornado';
         }
     
 }*/