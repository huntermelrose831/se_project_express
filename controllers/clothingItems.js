const ClothingItem = require("../models/clothingItem");
const BadRequestError = require("../utils/errors/BadRequestError");
const NotFoundError = require("../utils/errors/NotFoundError");
const ForbiddenError = require("../utils/errors/ForbiddenError");

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid data provided"));
      } else {
        next(err);
      }
    });
};
const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch(next);
};

const deleteItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const userId = req.user._id;

    // 1. Find the item or fail
    const item = await ClothingItem.findById(itemId).orFail();

    // 2. Check ownership
    if (item.owner.toString() !== userId) {
      throw new ForbiddenError("You are not authorized to delete this item");
    }

    // 3. If ownership is confirmed, delete the item
    await ClothingItem.findByIdAndDelete(itemId);

    // 4. Send success response
    return res.send({ message: "Item deleted successfully" });
  } catch (err) {
    // 5. A single catch block handles all errors gracefully
    if (err.name === "DocumentNotFoundError") {
      next(new NotFoundError("Item not found"));
    } else if (err.name === "CastError") {
      next(new BadRequestError("Invalid item ID"));
    } else {
      next(err);
    }
  }
};

const likeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid item ID"));
      } else if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Item not found"));
      } else {
        next(err);
      }
    });
};

const dislikeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } }, // remove _id from the array
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid item ID"));
      } else if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Item not found"));
      } else {
        next(err);
      }
    });
};

module.exports = {
  createItem,
  getItems,

  deleteItem,
  likeItem,
  dislikeItem,
};
