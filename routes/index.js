const router = require("express").Router();

const userRouter = require("./users");
const clothingItems = require("./clothingItems");
const { NOT_FOUND } = require("../utils/errors");
const { createUser, login } = require("../controllers/users");

// Public routes
router.post("/signin", login);
router.post("/signup", createUser);
router.use("/items", clothingItems);
//Protected routes
const auth = require("../middlewares/auth");
router.use(auth);
router.use("/users", userRouter);
router.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Requested resource not found" });
});

module.exports = router;
