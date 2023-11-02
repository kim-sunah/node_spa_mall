const mongoose = require("mongoose");

const commentsSchema = new mongoose.Schema({
  commentId: {
    type: Number,
    required: true,
    unique: true
  },
  postId: {
    type: Number,
    required: true
  },
  user: {
    type: String,
    required: true,
  },
  password: {
    type: String
  },
  content: {
    type: String
  },
  createdAt: {
    type: Date
  },
});

module.exports = mongoose.model("Comments", commentsSchema);