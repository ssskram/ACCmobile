export default async function putIncident(newIncident) {

    let data = JSON.stringify({
        AddressID: newIncident.coords,
        Address: newIncident.address,
        OwnersFirstName: newIncident.ownersFirstName,
        OwnersLastName: newIncident.ownersLastName,
        OwnersTelephone: newIncident.ownersTelephoneNumber,
        ReasonforVisit: newIncident.reasonForVisit,
        ADVPGHCode: newIncident.pghCode,
        CitationNumber: newIncident.citationNumber,
        Comments: newIncident.comments,
        CallOrigin: newIncident.callOrigin,
        Officers: newIncident.officerInitials,
        Open: newIncident.open,
        Note: newIncident.note,
        itemId: newIncident.itemId
    })
    let cleaned_data = data.replace(/'/g, '')
    fetch('https://365proxy.azurewebsites.us/accmobile/updateIncident', {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + process.env.REACT_APP_365_API
        }),
        body: cleaned_data,
    })
        .then(function () {
            location.reload()
        })

    console.log(newIncident)
    return true
}