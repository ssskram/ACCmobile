import { broadcastActivity } from '../../../sockets/comments'

export default async function putComment(load, id) {
    fetch('https://365proxy.azurewebsites.us/accmobile/comment?id=' + id, {
        method: 'PUT',
        headers: new Headers({
            'Authorization': 'Bearer ' + process.env.REACT_APP_365_API,
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(load),
    })
        .then(() => broadcastActivity(load.incidentID))
}
