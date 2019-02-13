export default async function putAnimal(newAnimal) {
    const status = await fetch('http://localhost:3000/accmobile/updateAnimal', {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + process.env.REACT_APP_365_API,
            'Content-Type': 'application/json'
        }),
        body: newAnimal,
    })
        .then(res => res.status)
    if (status == 200) return true
    else return false
}