// this document contains the client side functions for the incident description form

// call google map
// geocode address
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
    var address = document.getElementById('address').value;
    geocoder.geocode({'address': address}, function(results, status) {
      if (status === 'OK') {
        resultsMap.setCenter(results[0].geometry.location);
        infoWindow.setPosition(results[0].geometry.location);
        infoWindow.setContent(address);
        infoWindow.open(resultsMap);
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
}
    
// load bootstrap-select dropdowns
// if mobile, default to native mobile menu
$( document ).ready(function() {
    $("#form").show();
    $('.selectpicker').selectpicker();
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
    $('.selectpicker').selectpicker('mobile');
    }
});

// on submit, copy multi-selection contents to relay field for simple string posting
$(document).ready(function () {
$('#overlaytrigger2').click(function(){
    $('#reason').val( $('#reasonrelay').val() );
    $('#code').val( $('#coderelay').val() );
});
});