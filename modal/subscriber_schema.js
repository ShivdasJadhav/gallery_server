const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Subscriber = new Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
});
module.exports = mongoose.model("Subscriber", Subscriber);
