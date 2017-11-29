const path = require('path')
const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const session = require('express-session')
const passport = require('passport')
const db = require('./server/db')
const PORT = process.env.PORT || 3000;
const app = express()
const socketio = require('socket.io')
module.exports = app

// secrets implementation
if (process.env.NODE_ENV !== 'production') require('./secrets')

// passport registration
passport.serializeUser((user, done) => done(null, user.id))
passport.deserializeUser((id, done) =>
  db.models.user.findById(id)
    .then(user => done(null, user))
    .catch(done))

const createApp = () => {
  // logging middleware
  app.use(morgan('dev'))

  // body parsing middleware
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))

  // session middleware with passport
  app.use(session({
    secret: process.env.SESSION_SECRET || 'We know our app',
    resave: false,
    saveUninitialized: false
  }))
  app.use(passport.initialize())
  app.use(passport.session())

  // auth and api routes
  app.use('/auth', require('./server/auth'))
  app.use('/api', require('./server/api'))

  // static file-serving middleware
  app.use('/dist', express.static(path.join(__dirname, 'dist')));
  app.use('/vendor', express.static(path.join(__dirname, 'node_modules')));
  app.use('/public', express.static(path.join(__dirname, 'public')));

  // sends index.html
  app.get('/', (req, res, next) => res.sendFile(path.join(__dirname, 'index.html')));


  // error handling endware
  app.use((err, req, res, next) => {
    console.error(err)
    console.error(err.stack)
    res.status(err.status || 500).send(err.message || 'Internal server error.')
  })
}

const startListening = () => {
  // start listening (and create a 'server' object representing our server)
  const server = app.listen(PORT, () => console.log(`Listening on port ${PORT}`))

  // set up our socket control center
  const io = socketio(server)
  require('./server/socket')(io, db.models.user, db.models.streetspots);
}

// const syncDb = () => db.sync({force: true});
//Added seed promise after the sync promise
//original code is line above
//used for tesitng feel free to modify
const syncDb = () => {
  // do not need to seed "intersection, rule and sign" everytime
  return db.sync()
  .then( () => db.models.user.sync({force: true}))
  .then(() => db.models.streetspots.sync({force: true}))
  .then( () => {
    return db.seed();
  })
};

// This evaluates as true when this file is run directly from the command line,
// i.e. when we say 'node server/index.js' (or 'nodemon server/index.js', or 'nodemon server', etc)
// It will evaluate false when this module is required by another module - for example,
// if we wanted to require our app in a test spec
if (require.main === module) {
    syncDb()
    .then(createApp)
    .then(startListening)
} else {
  createApp()
}
