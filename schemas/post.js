const mongoose = require("mongoose");

const postsSchema = new mongoose.Schema({
  postId: {
    type: Number,
    required: true,
    unique: true
  },
  user: {
    type: String,
    required: true
  },
  password: {
    type: String
  },
  title: {
    type: String
  },
  content: {
    type: String
  },
});

module.exports = mongoose.model("Posts", postsSchema);