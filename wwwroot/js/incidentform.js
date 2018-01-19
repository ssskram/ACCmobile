// this document contains the client side functions for the incident view

// call google map
function initMap() {
    var point = {lat: 40.454447, lng: -79.968295};
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: point
    });
    var marker = new google.maps.Marker({
        position: point,
        map: map
    });
    }
    
// load bootstrap-select dropdowns
// if mobile, default to native mobile menu
$( document ).ready(function() {
    // once bootstrap-select is ready, bring the rest
    $("#form").show();
    $('.selectpicker').selectpicker();
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
    $('.selectpicker').selectpicker('mobile');
    }
});

// on submit, copy multi-selection contents to relay field for simple string posting
$(document).ready(function () {
$('#button').click(function(){
    $('#reason').val( $('#reasonrelay').val() );
    $('#code').val( $('#coderelay').val() );
});
});