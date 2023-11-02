const mongoose = require("mongoose");

const commentsSchema = new mongoose.Schema({
  commentsId: {
    type: Number,
    required: true,
    unique: true
  },
  postsId: {
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