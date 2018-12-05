// User model for MongoDB

// Import Mongoose
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

// Exporting the Model
// Setting the export equal to a variable (User), the set User equal to mondoose.model
// 1st arg is name we want to use for db, 2nd paramater is the schema
module.exports = User = mongoose.model("users", userSchema);
