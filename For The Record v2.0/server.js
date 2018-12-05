const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

// Requiring Routes from routes foler. They are usde below (see Use Routes Comment)
const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");

// Run express
const app = express();

// Body Parser Middleware (Allows us to access req.body wherever)
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Database Config - db holds the key
const db = require("./config/keys").mongoURI;

// Connecting to mongoDB through mongoose
mongoose
  .connect(db)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Passport middleware
app.use(passport.initialize());

// Passport Config
require("./config/passport")(passport);

// Use Routes. Connects to the routes/api folder. Assigns the routes to the corresponding files which we imported as variables above.
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

// Port for Heroku & Local
const port = process.env.PORT || 5000;
// Serve up static assets (usually on heroku)
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static("client/build"));
// }

// Setting up server to listen on given port
app.listen(port, () => console.log(`Server running on port ${port}`));
