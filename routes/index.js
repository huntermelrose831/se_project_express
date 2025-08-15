const router = require("express").Router();

const userRouter = require("./users");
const clothingItems = require("./clothingItems");
const { NOT_FOUND } = require("../utils/errors");

// Use the clothing items router for requests to /items
router.use("/items", clothingItems);
router.use("/users", userRouter);
router.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Requested resource not found" });
});
module.exports = router;
