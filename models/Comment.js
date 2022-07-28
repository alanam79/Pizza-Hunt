// Only need to import the functions you want, not the full library
const { Schema, model, Types } = require("mongoose");
// importing function from utils folder for the timestamp
const dateFormat = require("../utils/dateFormat");

// reply is a subdocument (documents in documents, so you can nest a schema in a schema), since we will never query reply only
const ReplySchema = new Schema(
  {
    // set custom id to avoid confusion with parent comment _id, must import types at top of code
    replyId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    replyBody: {
      type: String,
    },
    writtenBy: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      // a getter, this takes stored data and modifies/formats upon return,
      // in this case using the dateFormat() function that is imported at the tome of the code
      get: (createdAtVal) => dateFormat(createdAtVal),
    },
  },
  {
    toJSON: {
      // tell the schema it will use getters
      getters: true,
    },
    // set id to false because this is a virtual that Mongoose returns (and its not needed here)
    id: false,
  }
);

const CommentSchema = new Schema(
  {
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
      // a getter, this takes stored data and modifies/formats upon return, in this case using the dateFormat() function
      get: (createdAtVal) => dateFormat(createdAtVal),
    },
    // associate replies with comments by nesting into this schema
    replies: [ReplySchema],
  },
  {
    toJSON: {
      // tell the schema it will use virtuals and getters
      virtuals: true,
      getters: true,
    },
    // set id to false because this is a virtual that Mongoose returns (and its not needed here)
    id: false,
  }
);

// get a total count of replies - using the virtuals function of Mongoose
CommentSchema.virtual('replyCount').get(function() {
  return this.replies.length;
});

// create the Comment model using the CommentSchema
const Comment = model("Comment", CommentSchema);

module.exports = Comment;
