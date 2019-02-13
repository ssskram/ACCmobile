export default function setDropdowns(dropdowns, setState) {
    // set dropdowns
    var futureOrigin = [] as any
    var futureReason = [] as any
    var futureCode = [] as any
    var futureInitials = [] as any
    dropdowns.callOrigins.forEach(function (element) {
        var json = { "value": element.origin, "label": element.origin, "name": 'callOrigin' };
        futureOrigin.push(json)
    })
    dropdowns.reasonsForVisit.forEach(function (element) {
        var json = { "value": element.reason, "label": element.reason, "name": 'reasonForVisit' };
        futureReason.push(json)
    })
    dropdowns.citationNumbers.forEach(function (element) {
        var json = { "value": element.citation, "label": element.citation, "name": 'citationNumber' };
        futureCode.push(json)
    })
    dropdowns.officerInitials.forEach(function (element) {
        var json = { "value": element.initial, "label": element.initial, "name": 'officerInitials' };
        futureInitials.push(json)
    })
    setState({
        originOptions: futureOrigin,
        reasonOptions: futureReason,
        codeOptions: futureCode,
        initialsOptions: futureInitials
    })
}