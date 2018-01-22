// this document contains the client side functions for the address view

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

  heatmap = new google.maps.visualization.HeatmapLayer({
    data: getPoints(),
    map: map
  })

  // var points = [ {lat: 40.4406144, long: -80.00189820000003}, {lat: 40.4657376, long: -79.95336350000002}, {lat: 40.4544472, long: -79.9682952}, {lat : 40.4247173, long: -79.9638928}, {lat : 40.41736, long: -80.02153499999997}, {lat : 40.4583129, long: -79.973885}, {lat : 40.422189, long: -79.98732689999997}, {lat : 40.453145, long: -79.96733699999999}, {lat : 40.440072, long: -79.96733699999999}, {lat : 40.4463884, long: -79.95003400000002} ];  
  // points.forEach( point => {
  //   alert(point.lat);
  //   heatmap = new google.maps.visualization.HeatmapLayer({
  //     data: new google.maps.LatLng(point.lat, point.long),
  //     map: map
  //   })
  // })

  var card = document.getElementById('addresscontainer');
  var input = document.getElementById('autocomplete');
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
    infowindow.close();
    marker.setVisible(false);
    var place = autocomplete.getPlace();
    if (!place.geometry) {
      window.alert("No details available for input: '" + place.name + "'");
    }

    // write lat/long to addressid field
    $('#addressid').val(place.geometry.location);

    // if the place has a geometry, then present it on a map.
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(15);
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
}

function getPoints() {
  return [
    new google.maps.LatLng(40.4406144,-80.00189820000003),
    new google.maps.LatLng(40.4657376,-79.95336350000002),
    new google.maps.LatLng(40.4544472,-79.9682952),
    new google.maps.LatLng(40.4247173,-79.9638928),
    new google.maps.LatLng(40.41736,-80.02153499999997),
    new google.maps.LatLng(40.4583129,-79.973885),
    new google.maps.LatLng(40.422189,-79.98732689999997),
    new google.maps.LatLng(40.453145,-79.96733699999999),
    new google.maps.LatLng(40.440072,-80.00149299999998),
    new google.maps.LatLng(40.4463884,-79.95003400000002)
  ];
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