const router = require("express").Router();

const userRouter = require("./users");
const clothingItems = require("./clothingItems");

router.use("/items", clothingItems);
router.use("/users", userRouter);

module.exports = router;
