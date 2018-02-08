
function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 40.450714, lng: -79.985514},
      zoom: 12,
      disableDefaultUI: true
    });

    var gradient = [
      'rgba(0, 255, 255, 0)',
      'rgba(0, 255, 255, 1)',
      'rgba(0, 191, 255, 1)',
      'rgba(0, 127, 255, 1)',
      'rgba(0, 63, 255, 1)',
      'rgba(0, 0, 255, 1)',
      'rgba(0, 0, 223, 1)',
      'rgba(0, 0, 191, 1)',
      'rgba(0, 0, 159, 1)',
      'rgba(0, 0, 127, 1)',
      'rgba(63, 0, 91, 1)',
      'rgba(127, 0, 63, 1)',
      'rgba(191, 0, 31, 1)',
      'rgba(255, 0, 0, 1)'
    ]
    heatmap = new google.maps.visualization.HeatmapLayer({
      data: [],
      dissipating: true,
      gradient: gradient,
      radius: 7,
      opacity: .6,
      map: map
    });
  
    var jsonArray = [];
    var points = $('#mapdata').val();
    $.each(JSON.parse(points), function(i, jsondata) {
      var jsonObject = {};
      jsonObject.lat = jsondata[0];
      jsonObject.long = jsondata[1];
      jsonArray.push(new google.maps.LatLng(jsonObject.lat, jsonObject.long));
    });
    var pointArray = new google.maps.MVCArray(jsonArray);
    heatmap.setData(pointArray);
    heatmap.setMap(map);
  
    var card = document.getElementById('addresscontainer');
    var input = document.getElementById('search');
  
    map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(card);
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

    $('input[id="search"]').val(place.formatted_address).keyup()


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

      infowindowContent.children['place-address'].textContent = address;
      infowindow.open(map, marker);
    });
  }