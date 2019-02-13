export default async function putIncident(newIncident) {
    let success = true
    await fetch('http://localhost:3000/accmobile/updateIncident', {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + process.env.REACT_APP_365_API,
            'Content-Type': 'application/json'
        }),
        body: newIncident,
    })
        .catch(err => success = false)
        
    return success
}