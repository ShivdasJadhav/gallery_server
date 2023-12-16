const mongoose = require("mongoose");
const schema = mongoose.Schema;
const Art_schema = new schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    required: true,
  },
  user_id: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  likes: [{ type: String, ref: "User" }],
  views: [{ type: String, ref: "User" }],
});
module.exports = mongoose.model("Art", Art_schema);
