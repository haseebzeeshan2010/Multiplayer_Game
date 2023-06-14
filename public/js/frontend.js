const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
var socket = io();
const scoreEl = document.querySelector('#scoreEl')
const devicePixelRatio = window.devicePixelRatio || 1

canvas.width = innerWidth
canvas.height = innerHeight

const x = canvas.width / 2
const y = canvas.height / 2

const player = new Player(x, y, 10, 'white')
const frontEndPlayers = {}

socket.on("updatePlayers", (backEndPlayers) => {
  for (const id in backEndPlayers){
    const backEndPlayer = backEndPlayers[id]

    if (!frontEndPlayers[id]){
      frontEndPlayers[id] = new Player({
        x: backEndPlayer.x, 
        y: backEndPlayer.y, 
        radius: 10, 
        color: backEndPlayer.color
      })
    } else {
      frontEndPlayers[id].x = backEndPlayer.x
      frontEndPlayers[id].y = backEndPlayer.y
    }
  }
  for (const id in frontEndPlayers) {
    if(!backEndPlayers[id]){
      delete frontEndPlayers[id]
    }
  }
})



let animationId

function animate() {
  animationId = requestAnimationFrame(animate)
  c.fillStyle = 'rgba(0, 0, 0, 0.1)'
  c.fillRect(0, 0, canvas.width, canvas.height)

  for (const id in frontEndPlayers){
    const frontEndPlayer = frontEndPlayers[id]
    frontEndPlayer.draw()
  }
  
}

animate()

const keys = {
  w : {
    pressed : false
  },
  a : {
    pressed : false
  },
  s : {
    pressed : false
  },
  d : {
    pressed : false
  }
}
const SPEED = 10
const playerInputs = []
let sequenceNumber = 0
setInterval(() =>{
  if (keys.w.pressed){
    sequenceNumber++
    playerInputs.push({sequenceNumber, dx:0, dy: -SPEED})
    frontEndPlayers[socket.id].y -= SPEED
    socket.emit('keydown', 'KeyW')
  }
  if (keys.a.pressed){
    sequenceNumber++
    playerInputs.push({sequenceNumber, dx:0, dy: -SPEED})
    frontEndPlayers[socket.id].x -= SPEED
    socket.emit('keydown', 'KeyA')
  }
  if (keys.s.pressed){
    sequenceNumber++
    playerInputs.push({sequenceNumber, dx:0, dy: -SPEED})
    frontEndPlayers[socket.id].y += SPEED
    socket.emit('keydown', 'KeyS')
  }
  if (keys.d.pressed){
    sequenceNumber++
    playerInputs.push({sequenceNumber, dx:0, dy: -SPEED})
    frontEndPlayers[socket.id].x += SPEED
    socket.emit('keydown', 'KeyD')
  }
}, 15)

window.addEventListener('keydown',(event) =>{
  if (!frontEndPlayers[socket.id]) return
  switch(event.code){
    case 'KeyW':
      keys.w.pressed = true
      break
    case 'KeyA':
      keys.a.pressed = true
      break
    case 'KeyS':
      keys.s.pressed = true
      break
    case 'KeyD':
      keys.d.pressed = true
      break
  }
})

window.addEventListener('keyup',(event) =>{
  if (!frontEndPlayers[socket.id]) return
  switch(event.code){
    case 'KeyW':
      keys.w.pressed = false
      break
    case 'KeyA':
      keys.a.pressed = false
      break
    case 'KeyS':
      keys.s.pressed = false
      break
    case 'KeyD':
      keys.d.pressed = false
      break
  }
})

