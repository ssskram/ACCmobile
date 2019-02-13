export default function deleteAnimal(animal) {
    fetch('http://localhost:3000/accmobile/deleteAnimal?itemId=' + animal.itemID, {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + process.env.REACT_APP_365_API
        })
    })
        .then(() => location.reload())
}