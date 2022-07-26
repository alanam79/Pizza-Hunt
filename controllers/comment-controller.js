const { Comment, Pizza } = require("../models");

const commentController = {
  // add comment to pizza;
  addComment({ params, body }, res) {
    console.log(body);
    Comment.create(body)
      // get id of the comment
      .then(({ _id }) => {
        // Now that we've got an _id, we can use this to add the comment to a pizza
        return Pizza.findOneAndUpdate(
          { _id: params.pizzaId },
          //   push adds the data to the array, in this case, the pizza in question
          { $push: { comments: _id } },
          //    If we don't set , { new: true }, it will return the original document
          { new: true }
        );
      })
      .then((dbPizzaData) => {
        if (!dbPizzaData) {
          res.status(404).json({ message: "No pizza found with this id!" });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch((err) => res.json(err));
  },
  // remove comment
  removeComment({ params }, res) {
    Comment.findOneAndDelete({ _id: params.commentId })
      .then((deletedComment) => {
        if (!deletedComment) {
          return res.status(404).json({ message: "No comment with this id!" });
        }
        return Pizza.findOneAndUpdate(
          { _id: params.pizzaId },
          { $pull: { comments: params.commentId } },
          { new: true }
        );
      })
      .then((dbPizzaData) => {
        if (!dbPizzaData) {
          res.status(404).json({ message: "No pizza found with this id!" });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch((err) => res.json(err));
  },
};

module.exports = commentController;
