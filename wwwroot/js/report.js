// this document contains the client side functions for get/report

// datatable 
$.fn.dataTable.moment( 'MM/DD/YYYY HH:mm');
var table = $("#dt").DataTable({
    pageLength : 25,
    searching: false,
    paging: false,
    ordering: false,
    order: [[ 1, "desc" ]],
    bLengthChange: false,
    language: {
        emptyTable: "No animals associated with this incident"
    },
});
new $.fn.dataTable.Responsive( table, {} );

// create map
// locate incident on map
// set infowindow content to incident address, and incident guid
var map, infoWindow;
var address = $ ( "#address" ).text();
var incidentid = $ ( "#id" ).text();
var content = "<b>" + address + "</b> <br/>Incident ID:<br/>" + incidentid;
var lat = parseFloat(document.getElementById('lat').value);
var lng = parseFloat(document.getElementById('lng').value);
var lat_lng = {lat: lat, lng: lng};
function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: lat_lng,
        zoom: 16
      });
    var infoWindow = new google.maps.InfoWindow({
        content: content,
        center: lat_lng,
        position: lat_lng
    });
    infoWindow.open(map);
}                

$( "#editIncident" ).dialog({
    autoOpen: false,
});
$( "#incidentbutton" ).on( "click", function() {
    $( "#editIncident" ).dialog({
        width: 500,
        height: 550,
        autoOpen: false,
        hide: {
        effect: "explode",
        duration: 250
        }
    });
    $( "#editIncident" ).dialog( "open" );
});

$( "#editAnimal" ).dialog({
    autoOpen: false,
});
$( "#animaledit" ).on( "click", function() {
    $( "#editAnimal" ).dialog({
        width: 600,
        height: 550,
        autoOpen: false,
        hide: {
        effect: "explode",
        duration: 250
        }
    });
    $( "#editAnimal" ).dialog( "open" );
});