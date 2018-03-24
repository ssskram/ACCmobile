// this document contains the client side functions for the get/all view

// datepicker
$('.datepicker').datepicker({
  format: "mm/dd/yyyy"
});  

// datatable
$.fn.dataTable.moment( 'MM/DD/YYYY HH:mm');
var table = $("#dt").DataTable({
    pageLength : 25,
    searching: true,
    paging: true,
    ordering: true,
    order: [[ 2, "desc" ]],
    bLengthChange: false,
    language: {
        emptyTable: "No open incidents"
    },
    columnDefs: [
        { orderable: false, targets: 0 },
        { orderable: false, targets: 1 }
    ]
});
new $.fn.dataTable.Responsive( table, {} );

// search fields
$("#search").keyup(function(){
    table.search( this.value ).draw();
    $( "td" ).css("background-color", "");
});
$("#search2").keyup(function(){
    table.search( this.value ).draw();
    $( "td" ).css("background-color", "");
});
$("#datesearch").change(function(){
    table.search( this.value ).draw();
    $( "td" ).css("background-color", "");
});
$("#datesearch2").change(function(){
    table.search( this.value ).draw();
    $( "td" ).css("background-color", "");
});

// clear search fields on desktop view
var $dates = $('#datesearch').datepicker();
$('#clear').on('click', function () {
  $dates.datepicker('setDate', null);
  $('#search').val('');
  $('#search').keyup();
});

// clear search fields on mobile view
var $dates2 = $('#datesearch2').datepicker();
$('#clear2').on('click', function () {
  $dates2.datepicker('setDate', null);
  $('#search2').val('');
  $('#search2').keyup();
});

// create map with visualization layer
// heatmap points passed from controller
// get value from search field
// autocomplete based on geolocation
// filter table based on autocompleted address
// on successful autocomplete, pass to infowindow data from first row on table (most recent acitivity at address)
// if nothing exists in table, return 404 to infowindow
var map;
function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 40.426150, lng: -79.986672},
    zoom: 11
  });

  // reset map
  $('#clear').on('click', function () {
    map.setCenter({lat: 40.426150, lng: -79.986672}); 
    map.setZoom(11);
    infowindow.close();
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
    radius: 8,
    opacity: .3,
    map: map
  });

  var jsonArray = [];
  var points = $('#mapdata').text();
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
  $('#clear').delay(1500).fadeIn(500);
  $('#datesearch').delay(1500).fadeIn(500);
  $('#search').delay(1500).fadeIn(500);

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

    $('input[id="search"]').val(place.name);
    var set = $('input[id="search"]').val();
    table.search(set).draw();

    // if the place has a geometry, then present it on a map.
    map.setCenter(place.geometry.location);
    map.setZoom(13);
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

    date = $ ( "td" ).eq(2).find( "#date" ).text();
    href = $( "td" ).first().find( 'a' ).attr('href');
    href_formatted = '<a href="'+ href +'" target="_blank">Open report</a>'
    nothing = "No documented activity at this address"
    something = "Most recent activity near here:"
    infowindowContent.children['place-address'].textContent = address;
    if (href != null)
    {
      infowindowContent.children['status'].innerHTML = something;
      infowindowContent.children['date'].textContent = date;
      infowindowContent.children['link'].innerHTML = href_formatted;
      $( "td" ).css("background-color", "rgba(57, 172, 205, 0.03)");
    }
    else
    {
      infowindowContent.children['status'].textContent = nothing;
      infowindowContent.children['date'].textContent = "";
      infowindowContent.children['link'].innerHTML = "";
    }
    infowindow.open(map, marker);
  });
}
    