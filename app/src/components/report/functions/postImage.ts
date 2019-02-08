
export default async function postImage(state, incidentID) {


    // post image to blob
    // on success, post meta to blob

    // post meta to SP table
    const metaObj = {
        incidentID: incidentID,
        relativePath: setName(state.image[0].name),
        attachmentTitle: state.imageTitle,
        attachmentDescription: state.imageDescription
    }    
    await fetch("https://365proxy.azurewebsites.us/accMobile/attachmentMeta", {
        method: 'post',
        body: JSON.stringify(metaObj),
        headers: new Headers({
            'Authorization': 'Bearer ' + process.env.REACT_APP_365_API,
            'Content-Type': 'application/json'
        })
    })
}

const setName = originalName => {
    const identifier = Math.random().toString().replace(/0\./, '')
    return `${identifier}-${originalName}`
}