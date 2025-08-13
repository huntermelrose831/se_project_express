const router = require("express").Router();

const userRouter = require("./users");
const clothingItems = require("./clothingItems");

// Use the clothing items router for requests to /items
router.use("/items", clothingItems);
router.use("/users", userRouter);
router.use((req, res) => {
  res.status(404).send({ message: "Router not found" });
});
module.exports = router;
