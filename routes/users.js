const router = require("express").Router();
const { getCurrentUser, updateUser } = require("../controllers/users");

// GET /users/me route - get current user info
router.get("/me", getCurrentUser);
router.patch("/me", updateUser);

module.exports = router;
