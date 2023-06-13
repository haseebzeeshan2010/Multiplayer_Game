const express = require('express')
const app = express()

//socket.io setup
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {pingInterval: 2000, pingTimeout: 5000});

const port = 3000

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

const backendEndPlayers = {}

io.on('connection', (socket) => {
  console.log('a user connected');
  backendEndPlayers[socket.id] = {
    x: 500*Math.random(),
    y: 500*Math.random(),
    color: `hsl(${360*Math.random()}, 100%, 50%)`
  }

  io.emit('updatePlayers', backendEndPlayers)

  socket.on('disconnect', (reason) => {
    console.log(reason)
    delete backendEndPlayers[socket.id]
    io.emit('updatePlayers',backendEndPlayers)
  })
  socket.on('keydown', (keycode) => {

    switch(keycode){
      case 'KeyW':
        backendEndPlayers[socket.id].y -= 5
        break
      case 'KeyA':
        backendEndPlayers[socket.id].x -= 5
        break
      case 'KeyS':
        backendEndPlayers[socket.id].y += 5
        break
      case 'KeyD':
        backendEndPlayers[socket.id].x += 5
        break
    }
  })
});

setInterval(() =>{
  io.emit('updatePlayers',backendEndPlayers)
}, 15)




server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
