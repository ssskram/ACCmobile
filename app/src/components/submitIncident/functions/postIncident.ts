export default async function postIncident(incident) {
    const status = await fetch('https://365proxy.azurewebsites.us/accmobile/addIncident', {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + process.env.REACT_APP_365_API,
            'Content-Type': 'application/json'
        }),
        body: incident,
    })
        .then(res => res.status)
    if (status == 200) return true
    else return false
}