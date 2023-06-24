const express = require('express');
const path = require('path');
const socketIO = require('socket.io');
const http  = require('http');

/// inicializar express

const app = express();
const server  =  http.createServer(app);
const io = socketIO(server);

//settings
app.set('port', process.env.PORT || 3000);
//const PORT = process.env.PORT || 3000;
const IP = '192.168.0.5';

// middlewares


/// sockets 

require('./sockets')(io);

//// static files

app.use(express.static(path.join(__dirname, 'public')));



/// statrting server  

server.listen(app.get('port'), ()=> {
    console.log("server on port 3000");
});
/*
server.listen(PORT, IP, ()=> {
    console.log("server on port 3000");
});

*/


