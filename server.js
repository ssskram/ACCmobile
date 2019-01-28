const express = require('express')
const path = require('path')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const passport = require('passport')
const OutlookStrategy = require('passport-outlook').Strategy

// environment variables
require('dotenv').config()
const OUTLOOK_CLIENT_ID = process.env.OUTLOOK_CLIENT_ID
const OUTLOOK_CLIENT_SECRET = process.env.OUTLOOK_CLIENT_SECRET

// configure passport
passport.serializeUser(function (user, done) {
  done(null, user)
})
passport.deserializeUser(function (obj, done) {
  done(null, obj)
})
passport.use(new OutlookStrategy({
    clientID: OUTLOOK_CLIENT_ID,
    clientSecret: OUTLOOK_CLIENT_SECRET,
    callbackURL: 'signin-microsoft',
    proxy: true
  },
  function (accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      return done(null, profile)
    })
  }
))

// configure express
const app = express()
app.set('views', __dirname + '/auth')
app.set('view engine', 'ejs')
app.use(cookieParser())
app.use(bodyParser())

app.use(methodOverride())
app.use(session({
  secret: 'mmmmmCOOKIES',
  cookie: {
    _expires: (720 * 60 * 1000)
  }
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(express.static(__dirname + '/auth/assets'))

/*
Endpoints!!
Only one to retrieve email
*/

// returns user's email address
app.use('/getUser', function (req, res) {
  res.status(200).send({
    'email': req.user.emails[0].value,
    'organization': "City of Pittsburgh",
    'name': req.user.displayName
  })
})

/*
Routes!!
The auth workflow is handled server side
Once user is validated with pgh email address, 
the react app is delivered to client and all further
routing occurs there via wildcard
*/

// login page
app.get('/login', function (req, res) {
  req.logout()
  res.render('login', {
    user: req.user
  })
})

// logout endpoint, called from client
// logs out user and redirects to login page
app.get('/logout', function (req, res) {
  req.logout()
  res.redirect('/login')
})

// 401 page
app.get('/accessDenied', function (req, res) {
  req.logout()
  res.render('401')
})

// MS oauth service redirect
app.get('/auth',
  passport.authenticate('windowslive', {
    scope: [
      'https://outlook.office.com/Mail.Read'
    ]
  })
)
// ...and return
app.get('/signin-microsoft',
  passport.authenticate('windowslive', {
    failureRedirect: '/login'
  }),
  function (req, res) {
    // if user has pgh emal address, let through the gates
    if (req.user.emails[0].value.includes('@pittsburghpa.gov')) {
      res.locals.user = req.user
      res.redirect('/')
    } else { // otherwise, get lost!
      res.redirect('/accessDenied')
    }
  })

// all other routes get pushed through wildcard
// basically, some string tricks to ensure bundle gets imported correctly and then
// routing is deferred to react running in client
app.get('*', ensureAuthenticated, (req, res) => {
  const link = (req.path == '/' ? 'index.html' : req.path)
  const root = path.join(__dirname, 'app/build')
  res.sendFile(link, {
    root: root
  }, (error) => {
    if (error) {
      res.sendFile('/', {
        root: root
      })
    }
  })
})

// helper function to validate user on every route
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login')
}

const port = process.env.PORT || 5000
app.listen(port)
console.log(`Listening on ${port}`)