export default async function getAnimals(AdvisoryID) {
    const response = await fetch('https://365proxy.azurewebsites.us/accmobile/selectAnimals?AdvisoryID=' + AdvisoryID, {
        method: 'get',
        headers: new Headers({
            'Authorization': 'Bearer ' + process.env.REACT_APP_365_API
        })
    })
    const animals = await response.json()
    return animals
}