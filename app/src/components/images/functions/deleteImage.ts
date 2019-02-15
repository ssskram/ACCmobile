export default async function deleteImage(blob) {
    await fetch('https://blobby.azurewebsites.us/accMobile/deleteImage?blobName=' + blob.name, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + process.env.REACT_APP_BLOBLY_API,
            'Content-Type': 'application/json'
        })
    })
    await fetch('https://365proxy.azurewebsites.us/accMobile/deleteAttachment?itemId=' + blob.itemId, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + process.env.REACT_APP_365_API,
            'Content-Type': 'application/json'
        })
    })
    location.reload()
}