
export function subscribeToActivity(cb, incidentID) {
    const socket = returnSocket({ query: 'incidentID=' + incidentID })
    socket.on('data', function (data) {
        cb(null, data)
    })
    socket.emit('subscribe')
}

export function broadcastActivity(incidentID) {
    const socket = returnSocket({ query: 'incidentID=' + incidentID })
    socket.emit('update')
}

const returnSocket = (params) => require('socket.io-client')('https://restless.azurewebsites.us/accMobile/comments', params)