// this document contains the client side functions for the get/open view

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

// clear search fields
var $dates = $('#datesearch').datepicker();
var $dates2 = $('#datesearch2').datepicker();
$('#clear').on('click', function () {
  $dates.datepicker('setDate', null);
  $dates2.datepicker('setDate', null);
  table.columns( 1 ).search("").draw();
  $('#search').val('');
  $('#search').keyup();
});

// create map with visualization layer
// heatmap points passed from controller
// get value from search field
// autocomplete based on geolocation
// filter table based on autocompleted address
// on successful autocomplete, pass to infowindow data from first row on table (most recent acitivity at address)
// if nothing exists in table, return 404 to infowindow
var map;
var i;
function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 40.436288, lng: -79.994808},
    zoom: 11
  });

  // reset map
  $('#clear').on('click', function () {
    map.setCenter({lat: 40.436288, lng: -79.994808}); 
    map.setZoom(11);
    infowindow.close();
  });

  var jsonArray = [];
  var itemid;
  var points = $('#mapdata').text();
  $.each(JSON.parse(points), function(i, jsondata) {
    var jsonObject = {};
    jsonObject.lat = jsondata[0];
    jsonObject.long = jsondata[1];
    var itemid = jsondata[2];
    latlng = new google.maps.LatLng(jsonObject.lat, jsonObject.long);
    var icon = {
      url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png", 
      scaledSize: new google.maps.Size(35, 35), 
    };
    var marker = new google.maps.Marker(
      {        
      position: latlng,
      map: map, 
      optimized: false,
      icon: icon
      });
    marker.addListener('click', function() {
      map.setCenter(this.getPosition()); 
      map.setZoom(16);
      table.columns( 1 ).search( itemid ).draw();
      address = $ ( "td" ).eq(3).find( "#addressrelay" ).text();
      date = $ ( "td" ).eq(2).find( "#date" ).text();
      href = $( "td" ).first().find( 'a' ).attr('href');
      href_formatted = '<a href="'+ href +'" target="_blank">Open report</a>'
      infowindowContent.children['place-address'].textContent = address;
      infowindowContent.children['status'].innerHTML = "  Open incident";
      infowindowContent.children['date'].textContent = date;
      infowindowContent.children['link'].innerHTML = href_formatted;
      infowindow.open(map, marker);

    });
  });

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
    nothing = "No open incidents at this address"
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
    