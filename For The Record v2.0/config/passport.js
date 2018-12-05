// Create JWT passport strategy
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
// Bring in mongoose to search for user that comes with the payload
const mongoose = require("mongoose");
// Bring in user model. "users" comes from models/User module.exports
const User = mongoose.model("users");
// Bring in keys because it has our secret. We're sending secret with request so we need to validate it
const keys = require("./keys");

// Create empty object for options
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

// Passport is a parameter for require('./config/passport')(passport) in server.js (see Passport Config in server.js)
module.exports = passport => {
  // Use new JwtStrategy
  passport.use(
    // We pass in our options. We get back a function that gives us our payload and another function called done
    new JwtStrategy(opts, (jwt_payload, done) => {
      // Get user that's being sent in token. The payload should include user info that we included in the payload in users.js (see users.js above the jwt.sign)
      // Find user by id. We have the id from the jwt_payload object
      User.findById(jwt_payload.id)
        // Promise. We get user back
        .then(user => {
          // If the user is found, return the done function.
          if (user) {
            // 1st param is error (isn't one, so null), 2nd is user
            return done(null, user);
          }
          // If user isn't found, still return null, and false instead of user because there isn't one
          return done(null, false);
        })
        .catch(err => console.log(err));
    })
  );
};
