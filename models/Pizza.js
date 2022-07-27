// Only need to import the functions you want, not the full library
const { Schema, model } = require("mongoose");
// importing function from utils folder for the timestamp
const dateFormat = require("../utils/dateFormat");

const PizzaSchema = new Schema(
  {
    pizzaName: {
      type: String,
    },
    createdBy: {
      type: String,
    },
    createdAt: {
      type: Date,
      //   if no value is provided, this function will execute and provide a timestamp
      default: Date.now,
      // a getter, this takes stored data and modifies/formats upon return, in this case using the dateFormat() function
      get: (createdAtVal) => dateFormat(createdAtVal),
    },
    size: {
      type: String,
      default: "Large",
    },
    // could also specify 'Array" in place of []
    toppings: [],
    // parent id -> pizza keeping track of the child -> comment
    comments: [
      {
        // The below type of 'String' is just a placeholder. Will need to have it expect an ObjectID
        // type: String,

        type: Schema.Types.ObjectId,
        // The ref property is important because it tells the Pizza model which documents to search to find the right comments.
        ref: "Comment",
      },
    ],
  },
  {
    // tell the schema it will use virtuals and getters
    toJSON: {
      virtuals: true,
      getters: true,
    },
    // set id to false because this is a virtual that Mongoose returns (and its not needed here)
    id: false,
  }
);

// get total count of comments and replies on retrieval using Virtuals
PizzaSchema.virtual("commentCount").get(function () {
  return this.comments.length;
});

// create the Pizza model using the PizzaSchema
const Pizza = model("Pizza", PizzaSchema);

// export the Pizza model
module.exports = Pizza;
