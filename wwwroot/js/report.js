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
        modal: true,
        title: "Update incident",
        autoOpen: false,
        create: function( event, ui ) {
            $('.ui-dialog').append('<span class="ui-dialog-titlebar ui-dialog-bottomdrag"></span>');
        }
    });
    $( "#editIncident" ).dialog( "open" );
    $("select option[value='"+id+"']").prop("selected", false);
});

$( "#editAnimal" ).dialog({
    autoOpen: false,
});

var animalbuttons = document.getElementsByClassName('animaledit');
var dialog = function() {
    $( "#editAnimal" ).dialog({
        width: 500,
        height: 550,
        modal: true,
        title: "Edit animal information",
        autoOpen: false,
        create: function( event, ui ) {
            $('.ui-dialog').append('<span class="ui-dialog-titlebar ui-dialog-bottomdrag"></span>');
        }
    });
    $( "#editAnimal" ).dialog( "open" );
    $("select option[value='"+id+"']").prop("selected", false);
};
Array.from(animalbuttons).forEach(function(element) {
    element.addEventListener('click', dialog);
  });
