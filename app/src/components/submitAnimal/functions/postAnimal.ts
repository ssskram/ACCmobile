export default async function postAnimal(animal) {
    const status = await fetch('http://localhost:3000/accmobile/addAnimal', {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + process.env.REACT_APP_365_API,
            'Content-Type': 'application/json'
        }),
        body: animal,
    })
        .then(res => res.status)
    if (status == 200) return true
    else return false
}