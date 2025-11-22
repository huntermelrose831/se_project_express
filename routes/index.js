const router = require("express").Router();
const clothingItemRouter = require("./clothingItems");
const userRouter = require("./users");
const { login, createUser } = require("../controllers/users");
const auth = require("../middlewares/auth");
const {
  validateAuthentication,
  validateUserBody,
} = require("../middlewares/validation");

// Unprotected routes
router.post("/signin", validateAuthentication, login);
router.post("/signup", validateUserBody, createUser);

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

// 404 handled centrally in app.js -- no duplicate unknown-route middleware here

module.exports = router;
