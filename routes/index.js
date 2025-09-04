const router = require("express").Router();
const clothingItemRouter = require("./clothingItems");
const userRouter = require("./users");
const { login, createUser } = require("../controllers/users");
const auth = require("../middlewares/auth");
const { NOT_FOUND } = require("../utils/errors");

// Unprotected routes
router.post("/signin", login);
router.post("/signup", createUser);

// The GET /items route is public, but other /items routes are protected.
// We can't use router.use('/items', clothingItemRouter) before the auth middleware.
// Instead, we can get the specific controller for GET /items.
const { getItems } = require("../controllers/clothingItems");
router.get("/items", getItems);

// Authentication middleware
// All routes below this will be protected
router.use(auth);

router.use("/users", userRouter);
router.use("/items", clothingItemRouter); // Now the protected item routes are registered

router.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Router not found" });
});

module.exports = router;
