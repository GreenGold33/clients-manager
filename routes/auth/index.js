const express = require('express')
const router = express.Router()

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const session = require('express-session')
const cookieParser = require('cookie-parser')

const Account = require('../../models/Account')

router.use( cookieParser() );
router.use( session({
  secret: 'supersecretworddonottelltoanyone',
  resave: true,
  saveUninitialized: true
}) );

// Configure passport middleware
router.use(passport.initialize());
router.use(passport.session());

passport.use( new LocalStrategy( Account.authenticate() ) );
passport.serializeUser( Account.serializeUser() )
passport.deserializeUser( Account.deserializeUser() )

router.get('/register', (req,res) => res.render('register') )
router.get('/login', (req,res) => res.render('login') )

router.post('/login', passport.authenticate('local'), (req,res) => {
  console.log(req.user.username)
  res.redirect('/admin/clients');
}) ;

router.post('/register', function(req, res, next) {
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

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
})

module.exports = router