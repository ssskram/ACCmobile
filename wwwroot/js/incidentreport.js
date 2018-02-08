
var map, infoWindow;
function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
    });
    var geocoder = new google.maps.Geocoder();
    var set = function() {
        geocodeAddress(geocoder, map);
    };
    set();
}
function geocodeAddress(geocoder, resultsMap) {
    infoWindow = new google.maps.InfoWindow;
    var address = $ ( "#address" ).text();
    var incidentid = $ ( "#id" ).text();
    var content = "<b>" + address + "</b> <br/>Incident ID:<br/>" + incidentid;
    geocoder.geocode({'address': address}, function(results, status) {
      if (status === 'OK') {
        resultsMap.setCenter(results[0].geometry.location);
        infoWindow.setPosition(results[0].geometry.location);
        infoWindow.setContent(content);
        infoWindow.open(resultsMap);
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    })
}