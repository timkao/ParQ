const Stopwatch = require('timer-stopwatch');
module.exports = (io, User, Streetspots) => {
  io.on('connection', (socket) => {
    console.log(`A socket connection to the server has been made: ${socket.id}`);
  //Socket disconnection
    socket.on('disconnect', () => {
      console.log(`Connection ${socket.id} has left the building`)
    });
    
 
    // socket.on('fetch-spots', ()=>{
    //   return Streetspots.findAll({ where: { status: 'open' } })
    //     .then(_spots =>{
    //       let spots = _spots;
    //       setInterval(()=>{
    //         return  Streetspots.findAll({ where: { status: 'open' } })
    //           .then(latest => {
    //                 if(latest.length !== spots.length){
    //                   socket.emit('Update spots');
    //                   spots = latest;
    //                } 
    //           })
    //       }, 10000);     // run every ten seconds
    //     })
    // })

      Streetspots.statusController = (spot) => {
        const watch = new Stopwatch(60000); // A new countdown timer with 60 seconds
        watch.start(); 
        // Fires when the timer is done
        return watch.onDone(function () {
          console.log('Watch is complete and Changing status');
          spot.status = "expired";
          // socket.emit('Update spots');
          return spot.save()
            .then( ()=> {
              return socket.emit('Update Spots');     // return not neccessary here
            })
      });
    }
   
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
