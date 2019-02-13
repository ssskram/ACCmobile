export default async function postIncident(incident) {

    // await fetch('http://localhost:3000/accmobile/addIncident', {
    //     method: 'POST',
    //     headers: new Headers({
    //         'Authorization': 'Bearer ' + process.env.REACT_APP_365_API,
    //         'Content-Type': 'application/json'
    //     }),
    //     body: JSON.stringify(incident),
    // })

    console.log(incident)
    return true
}