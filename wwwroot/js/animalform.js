// this document contains the client side functions for the animal module

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
        $('#Submit span').text(Submitbuttontext);
    }
    else
    {
        $('#AddAnimal span').text(Addbuttontext);
        $('#Submit span').text(Submitbuttontext);
    }
}

// show "add animal" buttons when type is selected
function revealbuttons () {
    var animalname = $(".animal-name").val();
    var Addbuttontext = `+ Save ${animalname} and add another animal`;
    var Submitbuttontext = `+ Save ${animalname} and return home`;
    $('#AddAnimal span').text(Addbuttontext);
    $('#Submit span').text(Submitbuttontext);
    $("#AddAnimal").show();
    $("#Submit").show();
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
        $("#Submit").hide();
        $('#type').val( $('#typerelay').val() );
        $('#breed').val( $('#breedrelay').val() );
        $('#coat').val( $('#coatrelay').val() );
        $('#sex').val( $('#sexrelay').val() );
        $.ajax(
            {
                url: "/New_Incident/PostAnimal",
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
                url: "/New_Incident/_AddAnimal",
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
    if($("#typerelay").val().length != 0)
    {
        $("#form").hide();
        $('#type').val( $('#typerelay').val() );
        $('#breed').val( $('#breedrelay').val() );
        $('#coat').val( $('#coatrelay').val() );
        $('#sex').val( $('#sexrelay').val() );
        $.ajax(
            {
                url: "/New_Incident/PostAnimal",
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

// on submit, copy multi-selection contents to relay field for simple string posting
$(document).ready(function () {
    $('#Submit').click(function(){
        $('#type').val( $('#typerelay').val() );
        $('#breed').val( $('#breedrelay').val() );
        $('#coat').val( $('#coatrelay').val() );
        $('#sex').val( $('#sexrelay').val() );
    });
});



