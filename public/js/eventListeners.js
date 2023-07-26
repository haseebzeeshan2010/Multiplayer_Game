
addEventListener('click', (event) => {
        const playerPosition = {
            x: frontEndPlayers[socket.id].x,
            y: frontEndPlayers[socket.id].y,
        }
        const angle = Math.atan2(
            event.clientY * window.devicePixelRatio - playerPosition.y,
            event.clientX * window.devicePixelRatio - playerPosition.x 
        )
    // const velocity = {
    //     x: Math.cos(angle) * 8,
    //     y: Math.sin(angle) * 8
    // }
    socket.emit('shoot',{
        x:playerPosition.x,
        y:playerPosition.y,
        color:frontEndPlayers[socket.id].color, 
        angle
    })
    // frontEndProjectiles.push(
    //     new Projectile({
    //         x:playerPosition.x,
    //         y:playerPosition.y, 
    //         radius:5, color:frontEndPlayers[socket.id].color, 
    //         velocity
    //     })
    // ) 

    console.log(frontEndProjectiles)
})
