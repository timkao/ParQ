module.exports = (io, User, Streetspots) => {
  io.on('connection', (socket) => {
    console.log(`A socket connection to the server has been made: ${socket.id}`);
  //Socket disconnection
    socket.on('disconnect', () => {
      console.log(`Connection ${socket.id} has left the building`)
    });
    

    // 
    socket.on('fetch-spots', ()=>{
      return Streetspots.findAll({ where: { status: 'open' } })
        .then(_spots =>{
          let spots = _spots;
          // console.log('fetch-spots socket event fired and spots length', spots.length);
          setInterval(()=>{
            return  Streetspots.findAll({ where: { status: 'open' } })
              .then(latest => {
                    if(latest.length !== spots.length){
                      // console.log("TELLING FRONT-END TO UPDATE SPOTS OR fetch spots again", latest.length)
                      socket.emit('Update spots');
                      spots = latest;
                   } 
              })
          }, 10000);     // run every ten seconds
        })
    })
   
    //User logins
    socket.on('user-login', id => {
      User.findById(id)
        .then(user => {
          if (user) {
            user.socketId = socket.id;
            return user.save();
          }
        })
        .catch(err => console.log(err));
    })

  //User reports spot
    socket.on('new-spot-reported', reporterId => {
      console.log('------------------new spot');
      socket.broadcast.emit('A New Spot');
    })

  //User's reported spot is claimed
    socket.on('spot-taken-online', socketId => {
      console.log('--------------------on');
      socket.broadcast.to(socketId).emit('notifications', 'Thank you! A spot you reported is taken! You earned 100 point!');
      socket.broadcast.emit('A Spot Taken');
    })

    socket.on('spot-taken-offline', reporterId => {
      console.log('--------------------off');
      User.findById(reporterId)
        .then(user => {
          user.spotsTaken += 1;
          //console.log(user);
          return user.save();
        })
        .catch(err => console.log(err));
      socket.broadcast.emit('A Spot Taken');
    })
  })
}
