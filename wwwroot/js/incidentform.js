// this document contains the client side functions for the incident view

// load bootstrap-select dropdowns
// if mobile, default to native mobile menu
$( document ).ready(function() {
    $('.selectpicker').selectpicker();
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
    $('.selectpicker').selectpicker('mobile');
    }
    $("#form").show();
});

// on submit, copy multi-selection contents to relay field for simple string posting
$(document).ready(function () {
$('#button').click(function(){
    $('#reason').val( $('#reasonrelay').val() );
    $('#code').val( $('#coderelay').val() );
});
});