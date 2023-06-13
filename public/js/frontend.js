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

window.addEventListener('keydown',(event) =>{
  if (!frontEndPlayers[socket.id]) return


  switch(event.code){
    case 'KeyW':
      //frontEndPlayers[socket.id].y -= 5
      socket.emit('keydown', 'KeyW')
      break
    case 'KeyA':
      // frontEndPlayers[socket.id].x -= 5
      socket.emit('keydown', 'KeyA')
      break
    case 'KeyS':
      // frontEndPlayers[socket.id].y += 5
      socket.emit('keydown', 'KeyS')
      break
    case 'KeyD':
      // frontEndPlayers[socket.id].x += 5
      socket.emit('keydown', 'KeyD')
      break
  }
})