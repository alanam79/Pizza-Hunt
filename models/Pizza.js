// Only need to import the functions you want, not the full library
const { Schema, model } = require("mongoose");

const PizzaSchema = new Schema({
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
  },
  size: {
    type: String,
    default: "Large",
  },
  // could also specify 'Array" in place of []
  toppings: [],
});

// create the Pizza model using the PizzaSchema
const Pizza = model("Pizza", PizzaSchema);

// export the Pizza model
module.exports = Pizza;
