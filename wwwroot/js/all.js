// this document contains the client side functions for the get/all view

// datepicker
$('.datepicker').datepicker({
  format: "mm/dd/yyyy"
});  

// datatable
$.fn.dataTable.moment( 'MM/DD/YYYY HH:mm');
var table = $("#dt").DataTable({
    pageLength : 100,
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
$("#datesearch").change(function(){
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