const express = require("express");

const {
  getProducts,
  getProduct,

  createProduct,

  updateProduct,
  deleteProduct,

  DeleteAll,
  deleteManyProductByName,
  deleteManyProductByNameAndColor,
  deleteManyProductByNameAndSize,
  buyProduct,
} = require("../controller/product");

const router = express.Router();

router.route("/").get(getProducts).post(createProduct);

router.route("/:id").get(getProduct).patch(updateProduct).delete(deleteProduct);

router.post("/buy", buyProduct);

router.delete("/deleteByName", deleteManyProductByName);
router.delete("/deleteByNameAndColor", deleteManyProductByNameAndColor);
router.delete("/deleteByNameAndSize", deleteManyProductByNameAndSize);

router.delete("/deleteAll", DeleteAll);

module.exports = router;
