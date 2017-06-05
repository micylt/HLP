// script for calculating current geolocation
var map, infoWindow, marker, myCenter;

var clinicCallback = function geocodeAddress(geocoder, resultsMap, clinicResults) {
  var providers;
  var address;
  var providerCount = 0;
  var markers = [];
  var contents = [];
  var infowindows = [];
  console.log('running clinic callback...');
  // var address = document.getElementById('address').value;
  console.log(clinicResults);
  var services = clinicResults['services'];
  for (var i = 0; i < services.length - 1; i++) {
	  console.log('result: ' + i);
	  console.log(services[i]);

	  providers = services[i]['providers'];
	  for (var j = 0; j < providers.length; j++) {
		  provider = providers[j];
		  address = provider['streetAddress'] + ", " + provider['locality'] + ", " + provider['region'];
		  console.log(address);
		  geocoder.geocode({'address': address}, function(results, status) {
		    if (status === 'OK') {
				contents[providerCount] = '<div id="content">'+
			      '<div id="siteNotice">'+
			      '</div>'+
			      '<h6 id="firstHeading" class="firstHeading">' + provider['title'] + '</h6>'+
			      '<div id="bodyContent">'+
			      '<ul>' +
			  	  '<li>' + address + '</li>' +
			  	  '<li>(360)676-6177</li>' +
			  	  '<li><a href="http://unitycarenw.org/">unitycarenw.org</a></li>' +
			      '</ul>' +
			      '</div>'+
			      '</div>';

			  markers[providerCount] = new google.maps.Marker({
			    position: results[0].geometry.location,
			    map: resultsMap,
			    title: 'HLP'
			  });

			  markers[providerCount].index = providerCount;

			  infowindows[providerCount] = new google.maps.InfoWindow({
			    content: contents[providerCount],
			    maxWidth: 200
			  });

			//   google.maps.event.addListener(markers[j], 'click', function () {
    		// 		alert(markers[this.id].position);
			//   });
			  google.maps.event.addListener(markers[providerCount], 'click', function() {
			        infowindows[this.index].open(resultsMap, markers[this.index]);
		      });
		    //   resultsMap.setCenter(results[0].geometry.location);
		    //   var marker = new google.maps.Marker({
		    //     map: resultsMap,
		    //     position: results[0].geometry.location
		    //   });
		    } else {
		    //   alert('Geocode was not successful for the following reason: ' + status);
		    }
		  });
		  providerCount++;
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
	infoWindow = new google.maps.InfoWindow;

	// detect address search submit
	document.getElementById('submit').addEventListener('click', function() {
		var address = document.getElementById('address').value;
		var geoCords = geocode_input(address);
		clinicRequest(geoCords, geocoder, map, clinicCallback);
    });

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
function geocode_input(address) {
	console.log("geocode running...");
	// var old = address.elements[0].value;
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
			// logging for testing
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
