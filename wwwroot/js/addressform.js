// this document contains the client side functions for the address view

var placeSearch, autocomplete;

// on field focus, geolocate via browser to improve autocomplete responses
function geolocate() {
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
}

// call autocomplete on field entry
function initAutocomplete() {
  autocomplete = new google.maps.places.Autocomplete(
      (document.getElementById('autocomplete')),
      {types: ['geocode']});
  autocomplete.addListener('place_changed', fillInAddress);
  autocomplete.addListener('place_changed', checkAddress);
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