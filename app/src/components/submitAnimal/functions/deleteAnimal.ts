export default function deleteAnimal(animal) {
    fetch('https://365proxy.azurewebsites.us/accmobile/deleteAnimal?itemId=' + animal.itemID, {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + process.env.REACT_APP_365_API
        })
    })
        .then(() => location.reload())
}