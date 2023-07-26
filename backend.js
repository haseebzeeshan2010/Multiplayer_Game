const express = require('express')
const app = express()

// socket.io setup
const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server, { pingInterval: 2000, pingTimeout: 5000 })

const port = 3000

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})


const backEndProjectiles = {}

const backEndPlayers = {}
let projectileId = 0


io.on('connection', (socket) => {
  console.log('a user connected')
  backEndPlayers[socket.id] = {
    x: 500 * Math.random(),
    y: 500 * Math.random(),
    color: `hsl(${360 * Math.random()}, 100%, 50%)`,
    sequenceNumber: 0
  }

  io.emit('updatePlayers', backEndPlayers)

  socket.on('shoot', ({x,y,color,angle})=> {
    projectileId++;

    const velocity = {
        x: Math.cos(angle) * 8,
        y: Math.sin(angle) * 8
    }
    backEndProjectiles[projectileId] = {
      x,
      y,
      velocity,
      color,
      playerId: socket.id
    }
  })

  socket.on('disconnect', (reason) => {
    console.log(reason)
    delete backEndPlayers[socket.id]
    io.emit('updatePlayers', backEndPlayers)
  })

  socket.on('keydown', ({ keycode, sequenceNumber }) => {
    backEndPlayers[socket.id].sequenceNumber = sequenceNumber
    switch (keycode) {
      case 'KeyW':
        backEndPlayers[socket.id].y -= 0.6
        break

      case 'KeyA':
        backEndPlayers[socket.id].x -= 0.6
        break

      case 'KeyS':
        backEndPlayers[socket.id].y += 0.6
        break

      case 'KeyD':
        backEndPlayers[socket.id].x += 0.6
        break
    }
  })

  console.log(backEndPlayers)
})

setInterval(() => {
  io.emit('updatePlayers', backEndPlayers)
}, 7)

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

console.log('server did load')