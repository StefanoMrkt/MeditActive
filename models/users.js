const mongoose = require("mongoose");

var goalsSchema = new mongoose.Schema({
  types: [String],
  start: String,
  end: String,
});

var userSchema = new mongoose.Schema({
  name: String,
  surname: String,
  email: String,
  goals: [goalsSchema],
});

module.exports = mongoose.model("User", userSchema);
