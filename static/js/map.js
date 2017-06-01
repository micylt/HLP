// script for calculating current geolocation
var map, infoWindow, marker;
var myCenter= {lat: 48.752, lng: -122.479};

function initMap() {
	var mapDiv = document.getElementById('map');
	var searchBtn = document.getElementById('search-btn');
	map = new google.maps.Map(mapDiv, {
		center: myCenter,
		zoom: 12,
		mapTypeContol: true,
		mapTypeControlOptions: {
              style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
              position: google.maps.ControlPosition.BOTTOM_CENTER
        }
	});

	infoWindow = new google.maps.InfoWindow;

	// HTML5 geolocation
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			var pos = {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			};

			infoWindow.setPosition(pos);
			infoWindow.setContent('Location found.');
			infoWindow.open(map);

			map.setCenter(pos);

		}, function() {
		       handleLocationError(true, infoWindow, map.getCenter());
		   });
	} else {
		handleLocationError(false, infoWindow, map.getCenter());
	}

	google.maps.event.addDomListener(searchBtn, 'click', function() {
		  geocode_input();
    });
}

// handle errors
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
	infoWindow.setPosition(pos);
	infoWindow.setContent(browserHasGeolocation ?
		'Error: The Geolocation service failed.' :
		'Error: Your browser doesn\'t support geolocation.');
		infoWindow.open(map);
}

/* Used for retrieving address data (i.e. lat, lng, etc.) from Google Map API */
function geocode_input() {
	console.log("geocode running...");
	var x = document.getElementById("address_form");
	var old = x.elements[0].value;
	var replaced = old.replace(/\s/g, '+');
	var request = "https://maps.googleapis.com/maps/api/geocode/json?address=" + replaced + "&key=AIzaSyDj0h-T1onIDApJ9DHhP8-jfs0I26JcvLs";
	var pos = {};
    $.ajax({
        url : 'http://maps.google.com/maps/api/geocode/json',
        type : 'GET',
        data : {
            address : replaced,
            sensor : false
        },
        async : false,
        success : function(result) {
			console.log("yay");
            console.log(JSON.stringify(result));
			pos.lat = result.results[0].geometry.location.lat;
        	pos.lng = result.results[0].geometry.location.lng;
			pos.dist = 10;
			// logging for testing
			console.log(JSON.stringify(pos));
			// var clinicData = clinicRequest(pos); FIXME: uncomment and pass clinicData to displayClinics
			// for testing only !!!
			displayClinics(pos);
        }
    });
    return pos;
}

// retrieve clinics within radius of given position
function clinicRequest(pos) {
	$.ajax({
	  url: '/receiver',
	  type: 'POST',
	  data: JSON.stringify(pos),
	  contentType: "application/json",
	  success: function(data) {
		  console.log(data);
	  },
	  error: function(error) {
		  console.log(error);
	  }
	});
// stop link reloading the page
event.preventDefault();
}

// pin given clinic data on map FIXME: currently hard-coded. need to pass clinic data list and create markers for each clinic (also not working as hard-coded yet)
function displayClinics(clinicData) {
	var testLoc = {lat: 48.746, lng: -122.482};
	marker = new google.maps.Marker({
	    position:testLoc,
		map: map
	});

	marker.addListener('click', function() {
          infoWindow.open(map, marker);
    });
}
