const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const authRouter = require('./routes/auth')
const adminSectionRouter = require('./routes/admin')


const PORT = 3000
const app = express()

app.set('view engine', 'pug')
app.use( express.static('public') )

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const url = 'mongodb://localhost:27017/test'
mongoose.connect(url)

app.get('/about', (req,res) => res.send('this is about page') )
app.get('/', (req,res) => res.json(req.user) )

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/login');
}

app.use( authRouter )
app.use( '/admin', isLoggedIn, adminSectionRouter )

app.listen(PORT, () => console.log(`🚀  Magic happens on PORT ${PORT}...`))

