// this document contains the client side functions for the animal view

// load bootstrap-select dropdowns
// if mobile, default to native mobile menu
$( document ).ready(function() {
    $('.selectpicker').selectpicker();
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
    $('.selectpicker').selectpicker('mobile');
    }
    // once bootstrap-select is ready, bring the rest
    $("#form").show();
});

// parse available dropdown options based on animal type
function setheader () {
    $('#heading').val( $('#name').val() );
}

// repeat section
// reboot bootstrap-select
function addFields()
{
    $.ajax({
      url: "/Animal/AddAnimal",
      type: 'GET',
      success:function(result) {
          var newDiv = $(document.createElement("div"));  
          newDiv.html(result);
          newDiv.appendTo("#collectionItems");
          if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
          $('.selectpicker').selectpicker('mobile');
          }
          $('.selectpicker').selectpicker('refresh');
          $('#heading').val( $('#name').val() );
      },
      error: function(result) {
          alert("Failure");
      }
  });
}

// needed for enabling client side validation for newly added items
var updateValidation = function () {

    $('form').data('validator', null);
    $('form').data('unobtrusiveValidation', null);
    $.validator.unobtrusive.parse($('form'));

};

// on submit, copy multi-selection contents to relay field for simple string posting
$(document).ready(function () {
    $('#button').click(function(){
        $('#type').val( $('#typerelay').val() );
        $('#breed').val( $('#breedrelay').val() );
        $('#coat').val( $('#coatrelay').val() );
        $('#sex').val( $('#sexrelay').val() );
    });
});



