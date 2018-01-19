// this document contains the client side functions for the animal view

// load bootstrap-select dropdowns
// if mobile, default to native mobile menu
$( document ).ready(function() {
    // once bootstrap-select is ready, bring the rest
    $("#form").show();
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
    $('.selectpicker').selectpicker('mobile');
    }
});

// when entered, copy animal name to section header
// copy animal name to value string on addAnimal() button
// show addAnimal() button
function setheader () {
    var animalname = $(".animal-name").val();
    var buttontext = `+ Save ${animalname} and add another animal`;
    $('.animal-heading').val( $('.animal-name').val() );
    $("#header").show();
    $('#AddAnimal span').text(buttontext);
    $("#AddAnimal").show();
}

// post animal
// destroy <animal>
// regenerate <animal>
// populate <animal> with AddAnimal partialview
// reboot bootstrap-select
function addAnimal()
{
    if($("#name").val().length != 0 && $("#typerelay").val().length != 0)
    {
        $("animal").hide();
        $("#AddAnimal").hide();
        $('#type').val( $('#typerelay').val() );
        $('#breed').val( $('#breedrelay').val() );
        $('#coat').val( $('#coatrelay').val() );
        $('#sex').val( $('#sexrelay').val() );
        $.ajax(
            {
                url: "/Animal/PostAnimal",
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
                url: "/Animal/AddAnimal",
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
        alert("Animal name & animal type are required fields");
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



