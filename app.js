const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const session = require('express-session')
const cookieParser = require('cookie-parser')

const Client = require('./models/Client')
const Account = require('./models/Account')

const PORT = 3000
const app = express()

app.use( cookieParser() );
app.use( session({
  secret: 'supersecretworddonottelltoanyone',
  resave: true,
  saveUninitialized: true
}) );

// Configure passport middleware
app.use(passport.initialize());
app.use(passport.session());

passport.use( new LocalStrategy( Account.authenticate() ) );
passport.serializeUser( Account.serializeUser() )
passport.deserializeUser( Account.deserializeUser() )

app.set('view engine', 'pug')
app.use( express.static('public') )

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const url = 'mongodb://localhost:27017/test'
mongoose.connect(url)

app.get('/clients', isLoggedIn, (req,res) => {
  const {username} = req.user
  Client.find().then( clients => res.render('clients', { clients, username }) )
})

app.get('/client/new', (req,res) => {
  res.render('addClient')
})

app.get('/client/:id', isLoggedIn, (req,res) => {
  console.log (req.user)
  const { id } = req.params
  Client.findById(id).then( client => res.render('clientProfile', { client }) )
})

app.post('/clients', (req,res) => {
  const { name, address } = req.body
  const client = new Client({ name, address })
  client.save()
    .then( () => {
      res.redirect('/clients')
    })
})

app.get('/about', (req,res) => res.send('this is about page') )
app.get('/register', (req,res) => res.render('register') )
app.get('/login', (req,res) => res.render('login') )
app.get('/', isLoggedIn, (req,res) => res.json(req.user) )

app.post('/login', passport.authenticate('local'), (req,res) => {
  console.log(req.user.username)
  res.redirect('/clients');
}) ;

app.post('/register', function(req, res, next) {
  const { username, password } = req.body
  const account = new Account({ username })

  Account.register( account, password, function(err) {
    if (err) {
      console.log('error while user register!', err);
      return next(err);
    }

    console.log('user registered!');
    res.redirect('/login');
  });
})

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
})

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/login');
}

app.listen(PORT, () => console.log(`🚀  Magic happens on PORT ${PORT}...`))