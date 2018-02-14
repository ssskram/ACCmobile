// this document contains the datatable definitions for the incidents-by-address view

$.fn.dataTable.moment( 'MM/DD/YYYY HH:mm');
var table = $("#dt").DataTable({
    pageLength : 25,
    searching: true,
    paging: true,
    ordering: true,
    order: [[ 1, "desc" ]],
    bLengthChange: false,
    language: {
        emptyTable: "No incidents"
    },
    columnDefs: [
        { orderable: false, targets: 0 }
    ]
});
$('#search').on( 'keyup', function () {
    table.search( this.value ).draw();
} );
$('#search2').on( 'keyup', function () {
    table.search( this.value ).draw();
} );
$('#dropdown').on( 'change' , function () {
    table.search( this.value ).draw();
    $('#search').val('');
} );
new $.fn.dataTable.Responsive( table, {} );