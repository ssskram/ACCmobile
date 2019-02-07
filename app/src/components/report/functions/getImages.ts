export default async function getImages(itemId) {
    const imageArray = await fetch('https://365proxy.azurewebsites.us/accmobile/attachments?itemId=' + itemId, {
        method: 'get',
        headers: new Headers({
            'Authorization': 'Bearer ' + process.env.REACT_APP_365_API
        })
    })
        .then(res => res.json())
        .then(images => images)
    return imageArray
}