const { Pizza } = require("../models");

const pizzaController = {
  // get all pizzas - GET /api/pizza
  getAllPizza(req, res) {
    Pizza.find({})
      // populate the comments
      .populate({
        path: "comments",
        // need the - in front of the __v field or it will only return the __v field (version field)
        select: "-__v",
      })
      // below select will remove the pizza __v field to remove the noise from the code
      .select("-__v")
      // this is mongo's sort method in DESC order, this gets the newest pizza because the time stamp value is hidden inside the ObjectID
      .sort({ _id: -1 })
      .then((dbPizzaData) => res.json(dbPizzaData))
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  // get one pizza by id - GET /api/pizza/id
  getPizzaById({ params }, res) {
    Pizza.findOne({ _id: params.id })
      // populate the comment
      .populate({
        path: "comments",
        // need the - in front of the __v field or it will only return the __v field (version field)
        select: "-__v",
        //  the .sort() method here because we'd only be sorting a single pizza
      })
      // below select will remove the pizza __v field to remove the noise from the code
      .select("-__v")
      .then((dbPizzaData) => {
        // If no pizza is found, send 404
        if (!dbPizzaData) {
          res.status(404).json({ message: "No pizza found with this id!" });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  // createPizza - POST /api/pizzas
  // we are destructuring the body out of the express.js req object here
  createPizza({ body }, res) {
    Pizza.create(body)
      .then((dbPizzaData) => res.json(dbPizzaData))
      .catch((err) => res.status(400).json(err));
  },

  // update pizza by id - PUT /api/pizzas/:id
  updatePizza({ params, body }, res) {
    // By setting the parameter to true, we're instructing Mongoose to return the new version of the document
    // the "where" clause is used first - _id, then the updated data - body, then options for how the data should be returned.
    // the runValidators ensures Mongoose validates any new information entered
    Pizza.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
      .then((dbPizzaData) => {
        if (!dbPizzaData) {
          res.status(404).json({ message: "No pizza found with this id!" });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch((err) => res.status(400).json(err));
  },

  // delete pizza - DELETE /api/pizzas/:id
  deletePizza({ params }, res) {
    Pizza.findOneAndDelete({ _id: params.id })
      .then((dbPizzaData) => {
        if (!dbPizzaData) {
          res.status(404).json({ message: "No pizza found with this id!" });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch((err) => res.status(400).json(err));
  },
};

module.exports = pizzaController;
