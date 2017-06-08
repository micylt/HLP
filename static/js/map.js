var map, marker, myCenter;

// Displays markers of given clinic data on map
var clinicCallback = function geocodeAddress(geocoder, resultsMap, clinicResults) {
  var providers, address, phoneNumber, providerUrl, lat, lng;
  console.log('running clinic callback...');
  console.log(clinicResults);
  var services = clinicResults['services'];
  for (var i = 0; i < services.length - 1; i++) {
	  console.log('result: ' + i);
	  console.log(services[i]);

	  var infowindow = new google.maps.InfoWindow({});
	  var marker, content, j;
	  providers = services[i]['providers'];

	  for (j = 0; j < providers.length; j++) {
		  provider = providers[j];
		  address = provider['streetAddress'] + ", " + provider['locality'] + ", " + provider['region'];
		  providerUrl = provider['link'];
		  phoneNumber = provider['telephone'];
		  lat = provider['point']['lat'];
		  lng = provider['point']['long'];

		  content = '<div id="content">' +
					'<div id="siteNotice">' +
					'</div>' +
					'<h6 id="firstHeading" class="firstHeading">' + provider['title'] + '</h6>' +
					'<div id="bodyContent">' +
					'<ul>' +
					'<li>' + address + '</li>' +
					'<li>' + phoneNumber + '</li>' +
					'<li><a href="' + providerUrl + '">' + providerUrl + '</a></li>' +
					'</ul>' +
					'</div>' +
					'</div>';

		  marker = new google.maps.Marker({
			  position: new google.maps.LatLng(lat, lng),
			  map: resultsMap
		  });

		  google.maps.event.addListener(marker, 'click', (function (marker, content, infowindow) {
			  return function() {
				  infowindow.setContent(content);
				  infowindow.open(resultsMap, marker);
			  }
		  })(marker, content, infowindow));
	  }
   }
}

function initMap() {
	console.log("initializing map...");
	myCenter= new google.maps.LatLng(48.752, -122.479);
	var mapDiv = document.getElementById('map');
	map = new google.maps.Map(mapDiv, {
		center: myCenter,
		zoom: 14,
		mapTypeContol: true,
		mapTypeControlOptions: {
			style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
			position: google.maps.ControlPosition.BOTTOM_CENTER
		}
	});

	var geocoder = new google.maps.Geocoder();
	var infoWindow = new google.maps.InfoWindow({});

	// detect address search submit
	document.getElementById('submit').addEventListener('click', function() {
		var address = document.getElementById('address').value;
		var geoCords = geocode_input(address);
		clinicRequest(geoCords, geocoder, map, clinicCallback);
    });

	// calculate current location
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
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
	infoWindow.setPosition(pos);
	infoWindow.setContent(browserHasGeolocation ?
		'Error: The Geolocation service failed.' :
		'Error: Your browser doesn\'t support geolocation.');
		infoWindow.open(map);
}

/* Used for retrieving address data (i.e. lat, lng, etc.) from Google Map API */
function geocode_input(address) {
	console.log("geocode running...");
	var replaced = address.replace(/\s/g, '+');
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
			console.log(JSON.stringify(result));
			pos.lat = result.results[0].geometry.location.lat;
			pos.lng = result.results[0].geometry.location.lng;
			pos.dist = 10;
			console.log(JSON.stringify(pos));
		}
	});
	return pos;
}

// retrieve clinics within radius of given position
function clinicRequest(pos, geocoder, map, clinicCallback) {
	$.ajax({
		url: '/receiver',
		type: 'POST',
		data: JSON.stringify(pos),
		contentType: "application/json",
		success: function(data) {
			clinicCallback(geocoder, map, data);
		},
		error: function(error) {
			console.log(error);
		}
	});
	// stop link reloading the page
	event.preventDefault();
}
