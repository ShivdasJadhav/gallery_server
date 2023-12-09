const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const newUser = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    required: true,
  },
  contact: {
    type: String,
    required: true,
  },
  user_type: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    required: false,
  },
  img: {
    type: String,
    required: false,
  },
});
module.exports = mongoose.model("User", newUser);
