'use strict';

var express = require('express'),
    router = express.Router(),
    mongo = require('mongojs'),
    passport = require('passport'),
    bCrypt = require('bcrypt'),
    LocalStrategy = require('passport-local').Strategy,
    db = mongo('mongodb://antoniadis:2a4b6c!8@ds161069.mlab.com:61069/car_brand', ['users']),
    newUser = require('../ServerJavascript/User') // create the user
// As with any middleware it is quintessential to call next()
// if the user is authenticated
,
    auth = function auth(req, res, next) {
  // Cookies that have not been signed
  // let isAuthenticated = () => req.session.passport && req.session.passport.user? true : false
  // console.log('auth Cookies: ', req.cookies)
  // console.log('auth session passport ', req.session).
  console.log('auth session passport ' + ('' + isAuthenticated()), req.session);

  // if user is authenticated in the session, carry on 
  if (req.isAuthenticated()) return next();
  // if they aren't redirect them to the home page
  res.json({ message: 'You have to sign in ..' });
}

/* -------------------------- passport Strategy -------------------------- */
// Compares hashed passwords using bCrypt
,
    isValidPassword = function isValidPassword(user, password) {
  return bCrypt.compareSync(password, user.password);
}

// Generates hash using bCrypt
,
    createHash = function createHash(password) {
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10));
};

passport.serializeUser(function (user, done) {
  console.log('serializeUser: ' + user);
  done(null, user._id);
});

passport.deserializeUser(function (id, done) {

  var fixeduser = {};
  console.log('deserializeUser: ' + id);
  done(null, id);
  // db.users.findOne({_id: mongo.ObjectId(id)}, function(err, user) {
  //   fixeduser = {
  //     id: user._id,
  //     username: user.Firstname, 
  //     name: user.Firstname + ' ' + user.Lastname
  //   }
  //   done(err, id)
  // })
});

passport.use('login', new LocalStrategy(function (username, password, done) {

  var findOrUserLoggin = function findOrUserLoggin() {
    // Auth Check Logic
    // check in mongo if a user with username exists or not
    console.log('username ' + username + ' password ' + password);

    db.users.findOne({ $or: [{ username: username }, { email: username }, { mobile: username }] }, function (err, user) {
      // In case of any error, return using the done method
      if (err) return done(err);
      // Username does not exist, log error & redirect back
      if (!user) {
        console.log('User Not Found with username ' + username);
        return done(null, false, 'Your info was incorrect. Try again.');
      }
      // User exists but wrong password, log the error 
      if (!isValidPassword(user, password)) {
        console.log('User Not Found with password ' + password);
        console.log('Invalid Password');
        return done(null, false, 'Your info was incorrect. Try again.');
      }

      // User and password both match, return user from 
      // done method which will be treated like success
      var resetedUser = newUser.reset(user);
      console.log('login func user: ' + user._id + ' ');
      return done(null, resetedUser);
    });
  };

  // Delay the execution of findOrUserLoggin and execute 
  // the method in the next tick of the event loop
  process.nextTick(findOrUserLoggin);
}));

passport.use('signup', new LocalStrategy({ passReqToCallback: true }, function (req, username, password, done) {
  // find for firstname and lastname and mobile
  var user = req.body.user,
      findOrCreateUser = function findOrCreateUser() {

    console.log('user: ' + JSON.stringify(user));
    // find a user in Mongo with provided username
    db.users.findOne({ $or: [{ username: username }, { username: user.email }, { email: user.email }, { mobile: user.mobile }] }, function (err, userexist) {
      // In case of any error return
      if (err) {
        console.log('Error in SignUp: ', err);
        return done(err);
      }

      if (!user) {
        console.log('error Bad data');
        return done(null, false, { "message": "Bad data" });
      }
      // already exists
      if (userexist) {
        console.log('User already exists');
        return done(null, false, { 'message': 'User Already Exists' });
      } else {

        user.username = username;
        user.password = createHash(password);
        // save the user
        db.users.save(user, function (err, users) {
          if (err) {
            console.log('Error in Saving user: ', err);
            return done(null, false, { 'message': 'Error in Saving user, ' + err });
          }
          // if there is no user with that email
          // set the user's local credentials
          user = newUser.reset(users);

          return done(null, user);
        });
      }
    });
  };

  // Delay the execution of findOrCreateUser and execute 
  // the method in the next tick of the event loop
  process.nextTick(findOrCreateUser);
}));

// Angular Routes

/**
 * https Router Gets
 */

router.get('/logout', logout); // try to logout
router.get('/loggedIn', loggedIn); // get Loggin status

/**
 * https Router Posts
 */
router.post('/login', login); // try to login
router.post('/signup', createUser); // try to Create new User

/**
 * https Router Delete
 */

/**
 * https Router Put
 */

// ---------- https Functions ToDo ----------
function login(req, res) {

  passport.authenticate('login', function (err, user, info) {

    if (err) return res.json({ message: err });
    if (!user) {
      return res.json({ message: info });
    } else req.logIn(user, function (err) {
      if (err) return res.json(err);
      // console.log(`req.logIn: ${req.user._id} and auth = ` + req.isAuthenticated() + '!! ')
      console.log('User connected');
      return res.json(user);
    });
  })(req, res);
}

function logout(req, res, next) {

  req.logOut();
  console.log('User disconnected');
  res.json('disconnected');
}

function loggedIn(req, res, next) {
  var aut = { status: req.isAuthenticated()
    // console.log(`Auth ${aut.status}`)
  };res.json(aut);
}

function createUser(req, res) {

  passport.authenticate('signup', function (err, user, info) {

    if (err) {
      // res.status(401)
      return res.json({ message: err });
    }
    if (!user) {
      // res.json({
      //     "status": "User Exist try again"
      // })
      // res.status(400)
      return res.json(info);
    } else console.log('db user saving: ' + JSON.stringify(user));
    console.log('User Registration successfully');
    return res.json(user);
  })(req, res);
}

// router.get('/views/*', serve_partial)


// function serve_partial(req,res) {

//     stripped = req.url.split('.')[0]
//     requestedView = path.join('./', stripped)
//     res.render(requestedView, function(err, html) {
//         if(err) res.render('404')
//         else res.send(html)
//     })
// }

module.exports = router;