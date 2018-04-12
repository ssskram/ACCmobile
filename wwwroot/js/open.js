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
});
$("#search2").keyup(function(){
    table.search( this.value ).draw();
});
$("#datesearch").change(function(){
    table.search( this.value ).draw();
});
$("#datesearch2").change(function(){
    table.search( this.value ).draw();
});

// clear search fields on desktop view
var $dates = $('#datesearch').datepicker();
$('#clear').on('click', function () {
  table.columns( 1 ).search("").draw();
  $dates.datepicker('setDate', null);
  $('#search').val('');
  $('#search').keyup();
});

// clear search fields on mobile view
var $dates2 = $('#datesearch2').datepicker();
$('#clear2').on('click', function () {
  table.columns( 1 ).search("").draw();
  $dates2.datepicker('setDate', null);
  $('#search2').val('');
  $('#search2').keyup();
});

// create map with visualization layer
// heatmap points passed from controller
// get value from search field
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
      reason = $ ( "td" ).eq(4).find( "#reason" ).text();
      href = $( "td" ).first().find( 'a' ).attr('href');
      href_formatted = '<a href="'+ href +'" target="_blank">Open report</a>'
      infowindowContent.children['place-address'].textContent = address;
      infowindowContent.children['status'].innerHTML = reason;
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

  var infowindow = new google.maps.InfoWindow();
  var infowindowContent = document.getElementById('infowindow-content');
  infowindow.setContent(infowindowContent);
  var marker = new google.maps.Marker({
    map: map,
    anchorPoint: new google.maps.Point(0, -29)
  });
}
    