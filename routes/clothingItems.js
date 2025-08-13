const router = require("express").Router();

const {
  createItem,
  getItems,
  getItem,
  updateItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");
router.post("/", createItem);
router.get("/", getItems);
router.get("/:itemId", getItem);
router.put("/:itemId", updateItem);
router.delete("/:itemId", deleteItem);
router.put("/:itemId/likes", likeItem);
router.delete("/:itemId/likes", dislikeItem);
module.exports = router;
