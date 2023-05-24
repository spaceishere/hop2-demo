const express = require("express");

const {
  addProduct,
  removeProduct,
  removeFromCart,
} = require("../controller/cart");

const router = express.Router();

router.route("/:id").post(addProduct).delete(removeProduct);
router.route("/removeFromCart").post(removeFromCart);

module.exports = router;
