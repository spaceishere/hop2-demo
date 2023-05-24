const Cart = require("../model/cart.js");
const Product = require("../model/product.js");
const asyncHandler = require("../middleware/asyncHandler.js");

exports.addProduct = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ owner: req.params.id });

  if (!cart) throw new Error("Cart not found");

  const product = await Product.findOne({ ...req.body });

  cart.products.item = [...cart.products.item, product._id];

  cart.products.count = req.body.count;

  cart.save();

  res.status(200).json({ sucess: true, data: cart });
});

exports.removeFromCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ owner: req.body.userId });

  if (!cart) throw new Error("Cart not found");

  cart.products.filter((item) => item.item !== req.body.productId);

  await cart.save();

  res.status(200).json({ sucess: true, data: cart });
});

exports.removeProduct = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ owner: req.params.id });

  if (!cart) throw new Error("Cart not found");

  if (cart.products.length === 0) throw new Error("cart is empty");

  cart.products = cart.products.filter((item) => req.body.product !== item);

  cart.save();

  res.status(200).json({ sucess: true, data: cart });
});
