// Going to deal with authentication
const express = require("express");
// Now rather than saying app.get, it's router.get
const router = express.Router();
// Import secret from keys
const keys = require("../../config/keys");
// Import passport to create a protected/private route
const passport = require("passport");

// Import gravatar, bcrypt, jwt
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Import User Model
const User = require("../../models/User");

// Don't need to include "/api/users" because we already did it in server.js (see Use Routes Comment in server.js)
// res.json outputs json format

//// Tests users Route
//// @route     GET api/users/test
//// @access    Public
router.get("/test", (req, res) => res.json({ msg: "Users Route Works" }));

//// Register User
//// @route     POST api/users/register
//// @access    Public
router.post("/register", (req, res) => {
  // Use mongoose to find if the email exists
  User.findOne({ email: req.body.email })
    // Promise. We get user back.
    .then(user => {
      // Check if a user with that email address exists
      if (user) {
        // Purposely throw 400 error for validation because the email already exists.
        return res.status(400).json({ email: "Email already exists" });
      } else {
        // Create Avatar
        const avatar = gravatar.url(req.body.email, {
          s: "200", // Size
          r: "pg", // Rating
          d: "mm" // Default
        });
        //CREATE NEW USER
        const newUser = new User({
          // Will ultimately come from React form (except avatar)
          name: req.body.name,
          email: req.body.email,
          avatar,
          password: req.body.password
        });

        // Password Encryption. Generate a Salt with bcrypt
        bcrypt.genSalt(10, (err, salt) => {
          // Hash the password
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            // Set password to hashed password
            newUser.password = hash;
            // Save the user in mongoose
            newUser
              .save()
              .then(user => res.json({ user }))
              .catch(err => console.log(err));
          });
        });
      }
    });
});

//// Login User / Return JWT Token
//// @route     POST api/users/login
//// @access    Public
router.post("/login", (req, res) => {
  // The user will submit a form with email & password, values will be in req.body because of body-parser
  const email = req.body.email;
  const password = req.body.password;

  // Find user by email using mongoose & User Model
  // Find email in db by req.body email value. ES6 key/value pair notation (same name. email: email)
  User.findOne({ email }).then(user => {
    // Check for user. Check if user variable that was sent back from promise is false
    if (!user) {
      // If no user, send 404 error
      return res.status(404).json({ email: "User Not Found." });
    }

    // If a user IS found, the above if statement will be skipped.
    // Check password. req.body.password is in plain text, db is hashed
    // Compare req.body.password to user variable password  (hashed pword in db)
    bcrypt.compare(password, user.password).then(isMatch => {
      // If the password matches
      if (isMatch) {
        // This is where we want to generate JWT Token

        // Create JWT payload for sign. These are the things we want from user
        const payload = { id: user.id, name: user.name, avatar: user.avatar };
        // Sign Token
        jwt.sign(
          payload, // Payload
          keys.secretOrKey, // Secret from keys.js
          { expiresIn: 3600 }, // Object. Token expires in 1 hour
          (err, token) => {
            // Callback func
            res.json({
              // Send success & token as res
              success: true,
              token: `Bearer ${token}` // Bearer token, certain type of protocall
            });
          }
        );
      } else {
        // If not, return 400 error
        return res.status(400).json({ password: "Password Invalid." });
      }
    });
  });
});

//// Return Current User
//// @route     GET api/users/current
//// @access    Private
router.get(
  "/current",
  // 1st param "jwt" is the strategy we're using, 2nd is session false because we're not using session. Route is now private
  passport.authenticate("jwt", { session: false }),
  // Callback. The user is in req.user from passport.js
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    });
  }
);

// We need to export the router for the server to pick it up
module.exports = router;
