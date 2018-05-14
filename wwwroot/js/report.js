// this document contains the client side functions for get/report

$(function() {
    $('#addresscheck').val( $('#autocomplete').val() );
});

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
var href = $( "#href" ).text();
var address = $ ( "#address" ).text();
var incidentid = $ ( "#id" ).text();
var link = '<a href="'+ href +'" target="_blank" style="font-size: 16px;">Take me there</a>'
var content = "<b>" + address + "</b> <br/>Incident ID:<br/>" + incidentid + "<br/>" + link;
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

    var input = document.getElementById('autocomplete');
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
    autocomplete.addListener('place_changed', function() {
        var place = autocomplete.getPlace();
        // write lat/long to addressid field
        $('#coords').val(place.geometry.location);
        // write zip to zip field
        $('#ziprel').val(place.address_components[7].short_name);
        $('#addresscheck').val( $('#autocomplete').val() );
    });
    autocomplete.addListener('place_changed', enableButton);
}           

// enable button when mandatory fields are addressed
function enableButton () 
{
    var autocomplete = $('#autocomplete').val();
    var address = $('#addresscheck').val();
    var reason = $("#reasonrelay").val();
    if ( reason !== null && autocomplete == address  )
    {
        $("#submitincident").prop("disabled",false);
    }
    else
    {
        $("#submitincident").prop("disabled",true);
        $("#checkmark").css("display", "none");
    }
    if ( autocomplete !== "" && autocomplete == address )
    {
        $("#checkmark").css("display", "block");
    }
}

// load edit incident form
$( "#editIncident" ).dialog({
    autoOpen: false,
});
var iWidth = $(window).width();
var incidentWidth = iWidth * 0.8;
$( "#incidentbutton" ).on( "click", function() {
    $( "#editIncident" ).dialog({
        width: incidentWidth,
        height: 'auto',
        modal: true,
        resizable: true,
        title: "Edit incident",
        autoOpen: false
    });
    $('#reasonrelay').selectpicker("deselectAll", true).selectpicker("refresh");
    $('#coderelay').selectpicker("deselectAll", true).selectpicker("refresh");
    $('#officersrelay').selectpicker("deselectAll", true).selectpicker("refresh");
    if ($('select[id=officersrelay] option:first').val() != "")
    {
        $('select[id=officersrelay] option:first').prop("selected", true).change().selectpicker("refresh");
    }
    if ($('select[id=coderelay] option:first').val() != "")
    {
        $('select[id=coderelay] option:first').prop("selected", true).change().selectpicker("refresh");
    }
    if ($('select[id=reasonrelay] option:first').val() != "")
    {
        $('select[id=reasonrelay] option:first').prop("selected", true).change().selectpicker("refresh");
    }
    $( "#editIncident" ).dialog( "open" );
    document.getElementById("incidentcomments").focus();
});

// load edit animal form
$( "#editAnimal" ).dialog({
    autoOpen: false,
});
var aWidth = $(window).width();
var animalWidth = iWidth * 0.8;
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
        // set rabies vac no
        var rabiesvacno = $(this).parent().parent().find( "#rabiesvacno" ).text();
        $('#animalrabiesvacno').val( rabiesvacno );
        // set rabies vac exp
        var rabiesvacexp = $(this).parent().parent().find( "#rabiesvacexp" ).text();
        $('#animalrabiesvacexp').val( rabiesvacexp );
        // set rabies vac exp
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
        width: animalWidth,
        height: 'auto',
        modal: true,
        resizable: true,
        title: "Edit animal",
        autoOpen: false
    });
    $('#typerelay').selectpicker("deselectAll", true).selectpicker("refresh");
    $('#breedrelay').selectpicker("deselectAll", true).selectpicker("refresh");
    $('#coatrelay').selectpicker("deselectAll", true).selectpicker("refresh");
    $('#sexrelay').selectpicker("deselectAll", true).selectpicker("refresh");
    $('#vetrelay').selectpicker("deselectAll", true).selectpicker("refresh");
    if ($('select[id=breedrelay] option:first').val() != "")
    {
        $('select[id=breedrelay] option:first').prop("selected", true).change();
    }
    if ($('select[id=typerelay] option:first').val() != "")
    {
        $('select[id=typerelay] option:first').prop("selected", true).change();
    }
    if ($('select[id=coatrelay] option:first').val() != "")
    {
        $('select[id=coatrelay] option:first').prop("selected", true).change();
    }
    if ($('select[id=sexrelay] option:first').val() != "")
    {
        $('select[id=sexrelay] option:first').prop("selected", true).change();
    }
    if ($('select[id=vetrelay] option:first').val() != "")
    {
        $('select[id=vetrelay] option:first').prop("selected", true).change();
    }
    $( "#editAnimal" ).dialog( "open" );
};
Array.from(animalbuttons).forEach(function(element) {
    element.addEventListener('click', getdata);
    element.addEventListener('click', dialog);
    element.addEventListener('click', setdropdowns);
  });

// load delete animal confirmation
$( "#deleteAnimal" ).dialog({
    autoOpen: false,
});
var deletebuttons = document.getElementsByClassName('animaldelete');
var getdeletedata = function() {
    // set itemid
    var id = $(this).parent().parent().find( "#itemid" ).text();
    $('#animalitemid2').val( id );
};
var deletedialog = function() {
    $( "#deleteAnimal" ).dialog({
        width: 325,
        height: 'auto',
        modal: true,
        resizable: true,
        title: "Delete animal",
        autoOpen: false
    });
    $( "#deleteAnimal" ).dialog( "open" );
}
Array.from(deletebuttons).forEach(function(element) {
    element.addEventListener('click', getdeletedata);
    element.addEventListener('click', deletedialog);
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
    var cleandata = data.replace(/\'/g, '');
    $.ajax(
        {
            url: "/UpdateIncident/PutIncident",
            type: 'POST',
            data: cleandata,
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
        $('#puttype').val($('#typerelay').val());
    }
    if ($('#breedrelay').val() != null)
    {
        var breed = $('#breedrelay').val().toString().split(',').join(', ');
        $('#putbreed').val( breed );
    }
    else
    {
        $('#putbreed').val($('#breedrelay').val());
    }
    if ($('#coatrelay').val() != null)
    {
        var coat = $('#coatrelay').val().toString().split(',').join(', ');
        $('#putcoat').val( coat );
    }
    else
    {
        $('#putcoat').val($('#coatrelay').val());
    }
    if ($('#sexrelay').val() != null)
    {
        var sex = $('#sexrelay').val().toString().split(',').join(', ');
        $('#putsex').val( sex );
    }
    else
    {
        $('#putsex').val($('#sexrelay').val());
    }
    var data = $('#editanimal').serialize();
    var cleandata = data.replace(/\'/g, '');
    $.ajax(
        {
            url: "/UpdateIncident/PutAnimal",
            type: 'POST',
            data: cleandata,
            success:function(result) {
                location.reload(true);
            },
            error: function(result) {
                alert("Failed to post.  Please try again.");
            }
        }
    );
}

function deleteAnimal () 
{ 
    var data = $('#deleteanimal').serialize();
    var cleandata = data.replace(/\'/g, '');
    $.ajax(
        {
            url: "/UpdateIncident/DeleteAnimal",
            type: 'POST',
            data: cleandata,
            success:function(result) {
                location.reload(true);
            },
            error: function(result) {
                alert("Failed to post.  Please try again.");
            }
        }
    );
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

// set event listener for animal type
document.getElementById("typerelay").addEventListener("change", function () {

    // ditch previously submitted breed and coat
    $('#breedrelay').find('.submitted').hide();
    $('#coatrelay').find('.submitted').hide();

    cleardropdowns();
    setdropdowns();
});
function cleardropdowns () 
{
    // clear exsiting selections
    $('#breedrelay option').attr("selected",false);
    $('#coatrelay option').attr("selected",false);
    $('.selectpicker').selectpicker('refresh');
}
function setdropdowns ()
{
    var type = $("#typerelay").val();
    if (type == "Cat")
    {
        // set breed for cat
        $('#breedrelay').find('.dog').hide();
        $('#breedrelay').find('.cat').show();
        $('#breedrelay').prop("disabled",false);

        // set coat for cat
        $('#coatrelay').find('.dog').hide();
        $('#coatrelay').find('.cat').show();

        $('.selectpicker').selectpicker('refresh');
    }
    else if (type =="Dog")
    {
        // set breed for dog
        $('#breedrelay').find('.cat').hide();
        $('#breedrelay').find('.dog').show();
        $('#breedrelay').prop("disabled",false);

        // set coat for dog
        $('#coatrelay').find('.cat').hide();
        $('#coatrelay').find('.dog').show();

        $('.selectpicker').selectpicker('refresh');
    }
    else
    {
        // disable breed and coat
        $('#breedrelay').prop("disabled",true);
        $('#coatrelay').prop("disabled",true);

        $('.selectpicker').selectpicker('refresh');
    }
}