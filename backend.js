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
const SPEED = 1.5//original was 10

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
        backendEndPlayers[socket.id].y -= SPEED
        break
      case 'KeyA':
        backendEndPlayers[socket.id].x -= SPEED
        break
      case 'KeyS':
        backendEndPlayers[socket.id].y += SPEED
        break
      case 'KeyD':
        backendEndPlayers[socket.id].x += SPEED
        break
    }
  })
});


setInterval(() =>{
  io.emit('updatePlayers',backendEndPlayers)
},1)//original was 15



server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
