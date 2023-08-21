const express = require('express');
const path = require('path');

const app = express();
const httpServer = require('http').createServer(app)
const io = require('socket.io')(httpServer);

app.use(express.static(path.join(__dirname, '../public')))

app.get('^*$', (req, res) => {
    return res.sendFile(path.resolve(__dirname, '../public/index.html'))
});


io.on('connection', (socket) =>{
    console.log('connected')

    socket.on('message', (data) =>{
        console.log(data.cleanContent)
        io.sockets.emit('message', data)
    })

    
    socket.on('configData', data => {
        console.log('server: ', data)
        io.sockets.emit('configData', data)
    })

})

httpServer.listen(5000);
console.log('listening port 5000')