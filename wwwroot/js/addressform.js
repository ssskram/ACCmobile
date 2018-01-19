// this document contains the client side functions for the address view

// start google map api
// on field focus, geolocate via browser to improve autocomplete responses

function geolocate() {
  autocomplete = new google.maps.places.Autocomplete(
    (document.getElementById('autocomplete')),
    {types: ['geocode']});
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

      autocomplete.addListener('place_changed', fillInAddress);
      autocomplete.addListener('place_changed', checkAddress);
    });
  }
}

// creates map
// logs field data, validates vield data, autocompletes field data
// geocodes address
// locates on map
function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 40.440625, lng: -79.995886},
    zoom: 13,
    disableDefaultUI: true
  });
  var card = document.getElementById('addresscontainer');
  var input = document.getElementById('autocomplete');

  map.controls[google.maps.ControlPosition.TOP_CENTER].push(card);

  var autocomplete = new google.maps.places.Autocomplete(input);

  var infowindow = new google.maps.InfoWindow();
  var infowindowContent = document.getElementById('infowindow-content');
  infowindow.setContent(infowindowContent);
  var marker = new google.maps.Marker({
    map: map,
    anchorPoint: new google.maps.Point(0, -29)
  });
  autocomplete.addListener('place_changed', fillInAddress);
  autocomplete.addListener('place_changed', checkAddress);
  autocomplete.addListener('place_changed', function() {
    infowindow.close();
    marker.setVisible(false);
    var place = autocomplete.getPlace();
    if (!place.geometry) {
      window.alert("No details available for input: '" + place.name + "'");
      return;
    }

    // If the place has a geometry, then present it on a map.
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17);
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
}

// copy field entry into duplicate field to validate with string == string
function fillInAddress() {
  $(
      function(){
        $('#address').val( $('#autocomplete').val() );
      }
  );
}

// if string == string, activate "next" button and display checkmark
function checkAddress () {
    var autocomplete = $('#autocomplete').val();
    var address = $('#address').val();
    if ( autocomplete == address)
    {
        $("#button").prop("disabled",false);
        $("#checkmark").css("display", "block");
    } 
    else 
    {
        $("#button").prop("disabled",true);
        $("#checkmark").css("display", "none");
    }
}