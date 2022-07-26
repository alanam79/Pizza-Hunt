// Only need to import the functions you want, not the full library
const { Schema, model } = require("mongoose");

const CommentSchema = new Schema({
  writtenBy: {
    type: String,
  },
  commentBody: {
    type: String,
  },
  createdAt: {
    type: Date,
    //   if no value is provided, this function will execute and provide a timestamp
    default: Date.now,
  },
});

// create the Comment model using the CommentSchema
const Comment = model("Comment", CommentSchema);

module.exports = Comment;
