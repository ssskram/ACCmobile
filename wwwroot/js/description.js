// this document contains the client side functions for new/description

// call google map
var map, infoWindow;
var address = document.getElementById('address').value;
var lat = parseFloat(document.getElementById('lat').value);
var lng = parseFloat(document.getElementById('lng').value);
var lat_lng = {lat: lat, lng: lng};
function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: lat_lng,
        zoom: 16
      });
    var infoWindow = new google.maps.InfoWindow({
        content: address,
        center: lat_lng,
        position: lat_lng
    });
    infoWindow.open(map);
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
$('#submit').click(function(){
    $('#reason').val( $('#reasonrelay').val() );
    $('#code').val( $('#coderelay').val() );
});
});

// enable button when mandatory fields are addressed
function enableButton () {
    var reason = $("#reasonrelay").val();
    if ( reason !== null )
    {
        $("#submit").prop("disabled",false);
    }
    else
    {
        $("#submit").prop("disabled",true);
    }
}