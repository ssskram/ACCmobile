// auto expand textarea height to fit contents
function textAreaAdjust(o) {
    o.style.height = "1px";
    o.style.height = (25+o.scrollHeight)+"px";
    }

// show overlay spinner on network activity
var classname = document.getElementsByClassName('overlaytrigger');
var overlay = function() {
    document.getElementById('overlayloader').style.display = 'flex';
};
Array.from(classname).forEach(function(element) {
    element.addEventListener('click', overlay);
});
