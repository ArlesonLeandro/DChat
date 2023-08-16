const express = require('express');
const path = require('path');
const fs = require('fs')

const app = express();
const httpServer = require('http').createServer(app)
const io = require('socket.io')(httpServer);

const React = require('react')
const {renderToString} = require('react-dom/server')
const {StaticRouter} = require('react-router-dom/server')

import App from '../App';

let config = {}

app.use(express.static(path.join(__dirname, '../public')))

app.get('^*$', (req, res) => {
    fs.readFile(path.resolve(__dirname,'../public/index.html'), 'utf-8', (err, data) => {
        if(err){
            console.error(err)
            return res.status(500).send("An error ocurred")
        }
        
    return res.send(
        data.replace(
            '<div id="root"></div>',
            `<div id="root">${renderToString(
                <StaticRouter location={req.url}>
                  <App/>
                </StaticRouter>
              )}</div>`
            )
        );
    });
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