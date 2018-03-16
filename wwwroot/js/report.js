// this document contains the client side functions for get/report

// datepicker
$('.datepicker').datepicker({
    format: "mm/dd/yyyy"
});  

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

// load edit incident form
$( "#editIncident" ).dialog({
    autoOpen: false,
});
$( "#incidentbutton" ).on( "click", function() {
    $( "#editIncident" ).dialog({
        width: 500,
        height: 550,
        modal: true,
        resizable: true,
        title: "Edit incident information",
        autoOpen: false,
        create: function( event, ui ) {
            $('.ui-dialog').append('<span class="ui-dialog-titlebar ui-dialog-bottomdrag"></span>');
        }
    });
    $('#reasonrelay').selectpicker("deselectAll", true).selectpicker("refresh");
    $('#coderelay').selectpicker("deselectAll", true).selectpicker("refresh");
    $('select option:nth-child(1)').prop("selected", true).change();
    $( "#editIncident" ).dialog( "open" );
});

// load edit animal form
$( "#editAnimal" ).dialog({
    autoOpen: false,
});
var animalbuttons = document.getElementsByClassName('animaledit');
var getdata = function() {
    // set regular input boxes
        // set itemid
        var id = $(this).parent().parent().find( "#itemid" ).text();
        $('#animalitemid').val( id );
        // set animal name
        var name = $(this).parent().parent().find( "#name" ).text();
        $('#animalname').val( name );
        // set animal age
        var age = $(this).parent().parent().find( "#age" ).text();
        $('#animalage').val( age );
        // set license number
        var licenseno = $(this).parent().parent().find( "#licenseno" ).text();
        $('#animallicenseno').val( licenseno );
        // set license year
        var licenseyr = $(this).parent().parent().find( "#licenseyr" ).text();
        $('#animallicenseyr').val( licenseyr );
        // set rabbies vac no
        var rabbiesvacno = $(this).parent().parent().find( "#rabbiesvacno" ).text();
        $('#animalrabbiesvacno').val( rabbiesvacno );
        // set rabbies vac exp
        var rabbiesvacexp = $(this).parent().parent().find( "#rabbiesvacexp" ).text();
        $('#animalrabbiesvacexp').val( rabbiesvacexp );
        // set rabbies vac exp
        var comments = $(this).parent().parent().find( "#comments" ).text();
        $('#animalcomments').val( comments );
    // set dropdowns
        // set animal type
        var type = $(this).parent().parent().find( "#type" ).text();
        $('select[id=typerelay] option:first').html(type);
        // set animal breed
        var breed = $(this).parent().parent().find( "#breed" ).text();
        $('select[id=breedrelay] option:first').html(breed);
        // set animal coat
        var coat = $(this).parent().parent().find( "#coat" ).text();
        $('select[id=coatrelay] option:first').html(coat);
        // set animal sex
        var sex = $(this).parent().parent().find( "#sex" ).text();
        $('select[id=sexrelay] option:first').html(sex);
        // set vet
        var vet = $(this).parent().parent().find( "#vet" ).text();
        $('select[id=vetrelay] option:first').html(vet);
};
var dialog = function() {
    $( "#editAnimal" ).dialog({
        width: 550,
        height: 550,
        modal: true,
        resizable: true,
        title: "Edit animal information",
        autoOpen: false,
        create: function( event, ui ) {
            $('.ui-dialog').append('<span class="ui-dialog-titlebar ui-dialog-bottomdrag"></span>');
        }
    });
    $('#typerelay').selectpicker("deselectAll", true).selectpicker("refresh");
    $('#breedrelay').selectpicker("deselectAll", true).selectpicker("refresh");
    $('#coatrelay').selectpicker("deselectAll", true).selectpicker("refresh");
    $('#sexrelay').selectpicker("deselectAll", true).selectpicker("refresh");
    $('#vetrelay').selectpicker("deselectAll", true).selectpicker("refresh");
    $('select[id=breedrelay] option:first').prop("selected", true).change();
    $('select[id=typerelay] option:first').prop("selected", true).change();
    $('select[id=coatrelay] option:first').prop("selected", true).change();
    $('select[id=sexrelay] option:first').prop("selected", true).change();
    $('select[id=vetrelay] option:first').prop("selected", true).change();
    $( "#editAnimal" ).dialog( "open" );
};
Array.from(animalbuttons).forEach(function(element) {
    element.addEventListener('click', getdata);
    element.addEventListener('click', dialog);
  });

// put incident updates to controller
function putIncident()
{
    if ($('#reasonrelay').val() != null)
    {
        var reason = $('#reasonrelay').val().toString().split(',').join(', ');
        $('#reason').val( reason );
    }
    else
    {
        $('#reason').val($('#reasonrelay').val());
    }
    if ($('#coderelay').val() != null)
    {
        var code = $('#coderelay').val().toString().split(',').join(', ');
        $('#code').val( code );
    }
    else
    {
        $('#code').val( $('#coderelay').val());
    }
    if ($('#officersrelay').val() != null)
    {
        var officers = $('#officersrelay').val().toString().split(',').join(', ');
        $('#officers').val( officers );
    }
    else
    {
        $('#officers').val( $('#officersrelay').val());
    }
    var data = $('#update').serialize();
    $.ajax(
        {
            url: "/UpdateIncident/PutIncident",
            type: 'POST',
            data: data,
            success:function(result) {
                location.reload(true);
            },
            error: function(result) {
                alert("Failed to post.  Please try again.");
            }
        }
    );
}

// put animal updates to controller
function putAnimal()
{
    if ($('#typerelay').val() != null)
    {
        var type = $('#typerelay').val().toString().split(',').join(', ');
        $('#puttype').val( type );
    }
    else
    {
        $('#puttype').val($('#typerelay').val().toString());
    }
    if ($('#breedrelay').val() != null)
    {
        var breed = $('#breedrelay').val().toString().split(',').join(', ');
        $('#putbreed').val( breed );
    }
    else
    {
        $('#putbreed').val($('#breedrelay').val().toString());
    }
    if ($('#coatrelay').val() != null)
    {
        var coat = $('#coatrelay').val().toString().split(',').join(', ');
        $('#putcoat').val( coat );
    }
    else
    {
        $('#putcoat').val($('#coatrelay').val().toString());
    }
    if ($('#sexrelay').val() != null)
    {
        var sex = $('#sexrelay').val().toString().split(',').join(', ');
        $('#putsex').val( sex );
    }
    else
    {
        $('#putsex').val($('#sexrelay').val().toString());
    }
    $.ajax(
        {
            url: "/UpdateIncident/PutAnimal",
            type: 'POST',
            data: $('#editanimal').serialize(),
            success:function(result) {
                location.reload(true);
            },
            error: function(result) {
                alert("Failed to post.  Please try again.");
            }
        }
    );
}

// enable button when mandatory fields are addressed
function enableButton () {
    var reason = $("#reasonrelay").val();
    if ( reason !== null )
    {
        $("#submit").prop("disabled",false);
    }
    else
    {
        $("#submit").prop("disabled",true);
    }
}

// expand and collapse all rows on button
$('#btn-show-all-children').on('click', function(){
    // Expand
    table.rows(':not(.parent)').nodes().to$().find('td:first-child').trigger('click');
});

// Handle click on "Collapse All" button
$('#btn-hide-all-children').on('click', function(){
    // Collapse
    table.rows('.parent').nodes().to$().find('td:first-child').trigger('click');
});