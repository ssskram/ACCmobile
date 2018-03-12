// this document contains the client side functions for the address validation form

// creates map
// on field focus, geolocate via browser to improve autocomplete responses
// logs field data, validates vield data, autocompletes field data
// geocodes address
// locates on map
function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 40.450714, lng: -79.985514},
    zoom: 12,
    disableDefaultUI: true
  });

  var card = document.getElementById('addresscontainer');
  var input = document.getElementById('autocomplete');

  // prohibit enter from submitting form
  $('#autocomplete').keydown(function (e) {
    if (e.which == 13 && $('.pac-container:visible').length) return false;
  });

  map.controls[google.maps.ControlPosition.TOP_CENTER].push(card);

  var autocomplete = new google.maps.places.Autocomplete(input);
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var geolocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      var circle = new google.maps.Circle({
        center: geolocation,
        radius: position.coords.accuracy
      });
      autocomplete.setBounds(circle.getBounds());
    });
  }

  var infowindow = new google.maps.InfoWindow();
  var infowindowContent = document.getElementById('infowindow-content');
  infowindow.setContent(infowindowContent);
  var marker = new google.maps.Marker({
    map: map,
    anchorPoint: new google.maps.Point(0, -29)
  });

  autocomplete.addListener('place_changed', function() {
    var ACcheck = $('#autocomplete').val();
    infowindow.close();
    marker.setVisible(false);
    var place = autocomplete.getPlace();
    if (!place.geometry) {
      window.alert("No details available for input: '" + place.name + "'");
    }
    // only permit Pittsburgh addresses
    if (!ACcheck.includes("Pittsburgh")) {
      window.alert("Only Pittsburgh addresses are permitted");
      input.value = "";
    }

    // write lat/long to addressid field
    $('#coords').val(place.geometry.location);

    // if the place has a geometry, then present it on a map.
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(13);
    }
    marker.setPosition(place.geometry.location);
    marker.setVisible(true);

    var address = '';
    if (place.address_components) {
      address = [
        (place.address_components[0] && place.address_components[0].short_name || ''),
        (place.address_components[1] && place.address_components[1].short_name || ''),
        (place.address_components[2] && place.address_components[2].short_name || '')
      ].join(' ');
    }

    infowindowContent.children['place-icon'].src = place.icon;
    infowindowContent.children['place-name'].textContent = place.name;
    infowindowContent.children['place-address'].textContent = address;
    infowindow.open(map, marker);
  });

  autocomplete.addListener('place_changed', fillInAddress);
  autocomplete.addListener('place_changed', checkAddress);
  $('#addresscontainer').delay(500).fadeIn(1000);
}

// check for pittsburgh address
// copy field entry into duplicate field to validate with string == string
function fillInAddress() {
  var autocomplete = $('#autocomplete').val();
  if (autocomplete.includes('Pittsburgh') && autocomplete !== null)
  {
    $(
      function(){
        $('#address').val( $('#autocomplete').val() );
      }
    )
  }
  else
  {
    return;
  }
}

// if string == string, activate "next" button and display checkmark
function checkAddress () {
    var autocomplete = $('#autocomplete').val();
    var address = $('#address').val();
    if ( autocomplete !== "" && autocomplete == address )
    {
        $("#submit").css("display", "block");
        $("#submit").css("margin", "0 auto");
        $("#checkmark").css("display", "block");
    } 
    else 
    {
        $("#submit").css("display", "none");
        $("#checkmark").css("display", "none");
    }
}