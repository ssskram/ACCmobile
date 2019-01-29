export default async function getIncident(AdvisoryID) {
    const response = await fetch('https://365proxy.azurewebsites.us/accmobile/selectIncident?AdvisoryID=' + AdvisoryID, {
        method: 'get',
        headers: new Headers({
            'Authorization': 'Bearer ' + process.env.REACT_APP_365_API
        })
    })
    const incident = await response.json()
    return incident[0]
}