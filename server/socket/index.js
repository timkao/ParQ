module.exports = (io, User) => {
  io.on('connection', (socket) => {
    console.log(`A socket connection to the server has been made: ${socket.id}`);

    socket.on('disconnect', () => {
      console.log(`Connection ${socket.id} has left the building`)
    });

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

    socket.on('spot-taken-online', socketId => {
      console.log('--------------------on');
      socket.broadcast.to(socketId).emit('notifications', 'Thank you! A spot you reported is taken! You earned 100 point!');
    })

    socket.on('spot-taken-offline', reporterId => {
      console.log('--------------------off');
      User.findById(reporterId)
      .then( user => {
        user.spotsTaken += 1;
        return user.save();
      })
      .catch( err => console.log(err));
    })

  })
}
