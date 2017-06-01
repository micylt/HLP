/* Used for retrieving address data (i.e. lat, lng, etc.) from Google Map API */
function geocode_input() {
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
			clinicRequest(pos);
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

// pin given clinic data on map
function displayClinics(clinicData) {
	var testLoc = {lat: -25.363, lng: 131.044};
	var testContent = '<div id="content">'+
            '<div id="siteNotice">'+
        	'</div>'+
            '<h1 id="firstHeading" class="firstHeading">content</h1>'+
            '<div id="bodyContent">'+
            '<p><b>Stuff</b> Hogwarts </p>'+
            '<p> (last visited June 22, 2009).</p>'+
            '</div>'+
            '</div>';

	var infowindow = new google.maps.InfoWindow({
  		content: contentString,
  		maxWidth: 200
	});

	var marker = new google.maps.Marker({
  		position: testLoc,
  		map: map,
  		title: 'School of the Year'
	});
	marker.addListener('click', function() {
  	infowindow.open(map, marker);
	});
}
