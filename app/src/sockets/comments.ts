
export function subscribeToActivity(cb, incidentID) {
    const socket = returnSocket({ query: 'incidentID=1234' })
    socket.on('data', function (data) {
        cb(null, data)
    })
    socket.emit('subscribe')
}

export function broadcastActivity() {
    const socket = returnSocket({ query: 'incidentID=1234' })
    socket.emit('update')
}

const returnSocket = (params) => require('socket.io-client')('https://restless.azurewebsites.us/accMobile/comments', params)