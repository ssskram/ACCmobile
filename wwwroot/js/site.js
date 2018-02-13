// auto expand textarea height to fit contents
function textAreaAdjust(o) {
    o.style.height = "1px";
    o.style.height = (25+o.scrollHeight)+"px";
    }

    // overlay trigger, button name either "overlaytrigger1" or "overlaytrigger2"
document.getElementById('overlaytrigger1')
    .addEventListener('click', function(e) {
    document.getElementById('overlayloader').style.display = 'flex';
});
document.getElementById('overlaytrigger2')
    .addEventListener('click', function(e) {
    document.getElementById('overlayloader').style.display = 'flex';
});