// this document contains the client side functions for the animal view

// load bootstrap-select dropdowns
// if mobile, default to native mobile menu
$.getScript('https://cdnjs.cloudflare.com/ajax/libs/bootstrap-select/1.12.4/js/bootstrap-select.min.js', function()
{
    $('.selectpicker').selectpicker('render');
    $( document ).ready(function() {
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
    $('.selectpicker').selectpicker('mobile');
    }
    });
});

// copy animal name to section header
$(document).ready(function () {
    $("#name").change(function() {
        $('#heading').val( $('#name').val() );
    });
});

// repeat section
// reboot bootstrap-select
function addFields()
{
    $.getScript('https://cdnjs.cloudflare.com/ajax/libs/bootstrap-select/1.12.4/js/bootstrap-select.min.js', function()
    {
        $.ajax({
            url: "/Animal/AnimalGeneralInfo",
            type: 'GET',
            success:function(result) {
                var newDiv = $(document.createElement("div"));  
                newDiv.html(result);
                newDiv.appendTo("#form");
                if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
                $('.selectpicker').selectpicker('mobile');
                }
                $('.selectpicker').selectpicker('refresh');
            },
            error: function(result) {
                alert("Failure");
            }
        });
    });
}

// on submit, copy multi-selection contents to relay field for simple string posting
$(document).ready(function () {
    $('#button').click(function(){
        $('#type').val( $('#typerelay').val() );
        $('#breed').val( $('#breedrelay').val() );
        $('#coat').val( $('#coatrelay').val() );
        $('#sex').val( $('#sexrelay').val() );
    });
});



