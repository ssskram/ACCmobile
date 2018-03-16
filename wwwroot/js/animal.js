// this document contains the client side functions for the animal form

// datepicker
$('.datepicker').datepicker({
    format: "mm/dd/yyyy"
});  

// load bootstrap-select dropdowns
// if mobile, default to native mobile menu
$( document ).ready(function() {
    $("#form").show();
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
    $('.selectpicker').selectpicker('mobile');
    }
});

// when entered, copy animal name to section header
// copy animal name to value string on "add animal" buttons
function setName () {
    var animalname = $(".animal-name").val();
    var animaltype = $(".animal-type").val();
    var Addbuttontext = `+ Save ${animalname} and add another animal`;
    var Submitbuttontext = `+ Save ${animalname} and return home`;
    if ( animalname !== "" )
    {
        $('#AddAnimal span').text(Addbuttontext);
        $('#complete span').text(Submitbuttontext);
    }
    else
    {
        $('#AddAnimal span').text(Addbuttontext);
        $('#complete span').text(Submitbuttontext);
    }
}

// show "add animal" buttons when type is selected
function revealbuttons () {
    var animalname = $(".animal-name").val();
    var Addbuttontext = `+ Save ${animalname} and add another animal`;
    var Submitbuttontext = `+ Save ${animalname} and return home`;
    $('#AddAnimal span').text(Addbuttontext);
    $('#complete span').text(Submitbuttontext);
    $("#AddAnimal").show();
    $("#complete").show();
}

// post animal
// destroy <animal>
// regenerate <animal>
// populate <animal> with AddAnimal partialview
// reboot bootstrap-select
function addAnimal()
{
    if($("#typerelay").val().length != 0)
    {
        $("animal").hide();
        $("#AddAnimal").hide();
        $("#complete").hide();
        if ($('#typerelay').val() != null)
        {
            var type = $('#typerelay').val().toString().split(',').join(', ');
            $('#type').val( type );
        }
        else
        {
            $('#type').val($('#typerelay').val());
        }
        if ($('#breedrelay').val() != null)
        {
            var breed = $('#breedrelay').val().toString().split(',').join(', ');
            $('#breed').val( breed );
        }
        else
        {
            $('#breed').val($('#breedrelay').val());
        }
        if ($('#coatrelay').val() != null)
        {
            var coat = $('#coatrelay').val().toString().split(',').join(', ');
            $('#coat').val( coat );
        }
        else
        {
            $('#coat').val($('#coatrelay').val());
        }
        if ($('#sexrelay').val() != null)
        {
            var sex = $('#sexrelay').val().toString().split(',').join(', ');
            $('#sex').val( sex );
        }
        else
        {
            $('#sex').val($('#sexrelay').val());
        }
        $.ajax(
            {
                url: "/NewIncident/PostAnimal",
                type: 'POST',
                data: $('form').serialize(),
                error: function(result) {
                    alert("Failed to post.  Please try again.");
                }
            }
        );
        $("animal").remove();
        $.ajax(
            {
                url: "/NewIncident/_Animal",
                type: 'GET',
                success:function(result) {
                    var newDiv = $(document.createElement('animal'));
                    newDiv.html(result);
                    newDiv.appendTo(".repeatcontainer");
                    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
                    $('.selectpicker').selectpicker('mobile');
                    }
                    $('.selectpicker').selectpicker('refresh');
                    // once bootstrap-select is ready, bring the rest
                    $("#form").show();
                },
                error: function(result) {
                    alert("Failed to load new animal form.  Please refresh page.");
                }
            }
        );
    }
    else
    {
        alert("Animal type is a required field");
    }
}

// validate entries and return home
function returnHome()
{
    if ($("#typerelay").val().length != 0)
    {
        $("#form").hide();
        if ($('#typerelay').val() != null)
        {
            var type = $('#typerelay').val().toString().split(',').join(', ');
            $('#type').val( type );
        }
        else
        {
            $('#type').val($('#typerelay').val());
        }
        if ($('#breedrelay').val() != null)
        {
            var breed = $('#breedrelay').val().toString().split(',').join(', ');
            $('#breed').val( breed );
        }
        else
        {
            $('#breed').val($('#breedrelay').val());
        }
        if ($('#coatrelay').val() != null)
        {
            var coat = $('#coatrelay').val().toString().split(',').join(', ');
            $('#coat').val( coat );
        }
        else
        {
            $('#coat').val($('#coatrelay').val());
        }
        if ($('#sexrelay').val() != null)
        {
            var sex = $('#sexrelay').val().toString().split(',').join(', ');
            $('#sex').val( sex );
        }
        else
        {
            $('#sex').val($('#sexrelay').val());
        }
        $.ajax(
            {
                url: "/NewIncident/PostAnimal",
                type: 'POST',
                data: $('#form').serialize(),
                success:function(result) {
                    var url = $("#RedirectHome").val();
                    location.href = url;
                },
                error: function(result) {
                    alert("Failed to post.  Please try again.");
                }
            }
        );
    }
    else
    {
        alert("Animal type is a required field");
    }
}

// render number of animals in box
$(document).ready(function () {
    $('#AddAnimal,#complete').click(function(){
        var old_quantity = $('#numberanimals').text();
        var new_animal = 1;
        var new_quantity = +old_quantity + +new_animal;
        $( "#numberanimals" ).text( new_quantity );
    });
});



