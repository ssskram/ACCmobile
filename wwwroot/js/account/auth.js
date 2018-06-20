// check to see if browser is IE
var isIE = !!navigator.userAgent.match(/Trident/g) || !!navigator.userAgent.match(/MSIE/g);
if (isIE) {
    alert("Sorry, this site will not work in Internet Explorer \nPlease open this url in a different web browser \n\n ...Chrome works quite nicely...");
    var eleman = document.getElementById("login");
    eleman.setAttribute("disabled", true);
    eleman.setAttribute("title", "Please use a different browser");
}

// show overlay spinner on network activity
// just add class "overlaytrigger" to buttons for this to pop off
var classname = document.getElementsByClassName('overlaytrigger');
var overlay = function() {
    document.getElementById('overlayloader').style.display = 'flex';
};
Array.from(classname).forEach(function(element) {
    element.addEventListener('click', overlay);
});