// script for calculating current geolocation
var map, infoWindow;

function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 48.752, lng: -122.479},
		zoom: 10
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
			console.log("Hogwarts");
			infoWindow.setContent('Location found.');
			infoWindow.open(map);

			map.setCenter(pos);

		}, function() {
		       handleLocationError(true, infoWindow, map.getCenter());
		   });
	} else {
		handleLocationError(false, infoWindow, map.getCenter());
	}
}

// handle errors
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
	infoWindow.setPosition(pos);
	infoWindow.setContent(browserHasGeolocation ?
		'Error: The Geolocation service failed.' :
		'Error: Your browser doesn\'t support geolocation.');
		infoWindow.open(map);
}
