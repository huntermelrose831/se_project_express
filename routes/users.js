const router = require("express").Router();
const {
  getUsers,
  createUser,
  getUser,
  getCurrentUser,
} = require("../controllers/users");

// GET /users/me route - get current user info
router.get("/me", getCurrentUser);

module.exports = router;
