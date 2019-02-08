export default async function getImages(incidentID) {
    const imageMeta = await fetch('https://365proxy.azurewebsites.us/accmobile/attachments?incidentID=' + incidentID, {
        method: 'get',
        headers: new Headers({
            'Authorization': 'Bearer ' + process.env.REACT_APP_365_API
        })
    })
        .then(res => res.json())
        .then(data => data)
    return imageMeta
}