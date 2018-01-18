// this document contains the client side functions for the incident view

function initMap() {
    var uluru = {lat: -25.363, lng: 131.044};
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 4,
        center: uluru
    });
    var marker = new google.maps.Marker({
        position: uluru,
        map: map
    });
    }
    
// load bootstrap-select dropdowns
// if mobile, default to native mobile menu
$( document ).ready(function() {
    $('.selectpicker').selectpicker();
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
    $('.selectpicker').selectpicker('mobile');
    }
    // once bootstrap-select is ready, bring the rest
    $("#form").show();
});

// on submit, copy multi-selection contents to relay field for simple string posting
$(document).ready(function () {
$('#button').click(function(){
    $('#reason').val( $('#reasonrelay').val() );
    $('#code').val( $('#coderelay').val() );
});
});