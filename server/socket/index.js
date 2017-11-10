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
      console.log('online------------------');
      socket.broadcast.to(socketId).emit('notifications', 'Thank you! The spot you reported is taken!')
    })

    socket.on('spot-taken-offline', reporterId => {
      User.findById(reporterId)
      .then( user => {
        console.log('not online ---------------------');
        user.notifications.push(`Thank you! The spot you reported is taken!`)
        return user.save();
      })
      .catch( err => console.log(err));
    })

  })
}
