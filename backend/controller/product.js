const Product = require("../model/product");
const Cart = require("../model/cart");
const asyncHandler = require("../middleware/asyncHandler");

exports.getProducts = asyncHandler(async (req, res) => {
  const select = req.query.select || {};

  if (req.query.select) delete req.query.select;

  const getProducts = await Product.find({ ...req.query }, select).populate(
    "owner"
  );

  res.status(200).json({ success: true, data: getProducts });
});

exports.getProduct = asyncHandler(async (req, res) => {
  let product = await Product.findById(req.params.id).populate("owner");

  const detail = await Product.aggregate([
    {
      $group: {
        _id: {
          size: "$size",
          color: "$color",
        },
        count: { $sum: "$count" },
      },
    },
    {
      $group: {
        _id: "$_id.size",
        colors: {
          $push: {
            color: "$_id.color",
            count: "$count",
          },
        },
        count: { $sum: "$count" },
      },
    },
    {
      $project: {
        _id: 0,
        size: "$_id",
        colors: 1,
        count: 1,
      },
    },
  ]);

  if (!product) throw new Error("Product not found");

  res.status(200).json({
    success: true,
    data: product,
    sizes: detail,
  });
});

exports.createProduct = asyncHandler(async (req, res) => {
  //SHiniig vvsgej bgaa uyeiin req.body bvgd baina yag shiniig vvsgej bgaam shig

  //Baraa nemj baival req.body
  // {
  //   name: "name";
  //   size: "size";
  //   howManyProductsAdded: "howManyProductsAdded";
  //   color: "color";
  // }

  const preProduct = await Product.findOne({
    name: req.body.name,
    size: req.body.size,
    color: req.body.color,
  });

  if (!preProduct) {
    const product = await Product.create(req.body);

    return res.status(200).json({ success: true, data: product });
  }

  if (!req.body.howManyProductsAdded)
    throw new Error("already created product with this size color name");

  preProduct.count += req.body.howManyProductsAdded;

  await preProduct.save();

  res.status(200).json({ success: true, data: preProduct });
});

exports.updateProduct = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const item = req.body;

  const product = await Product.findById(id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: `There is no product with the given ID(${id})`,
    });
  } else if (req.body.count > product.count) {
    return res.status(404).json({
      success: false,
      message: `We don't have enough product!`,
    });
  }

  if (req.body.color) throw new Error("you cant update color of a product");

  if (req.body.size) throw new Error("you cant update size of a product");

  for (let item in req.body) {
    product[item] = req.body[item];
  }

  await product.save();

  res.status(200).json({
    success: true,
    data: product,
  });
});

exports.deleteManyProductByName = asyncHandler(async (req, res) => {
  await Product.deleteMany({ name: req.body.name });

  res.status(200).json({ success: true });
});

exports.deleteManyProductByNameAndColor = asyncHandler(async (req, res) => {
  await Product.deleteMany({ name: req.body.name, color: req.body.color });

  res.status(200).json({ success: true });
});

exports.deleteManyProductByNameAndSize = asyncHandler(async (req, res) => {
  await Product.deleteMany({ name: req.body.name, size: req.body.size });

  res.status(200).json({ success: true });
});

exports.deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) throw new Error("Product not found");

  res.status(200).json({ success: true, data: product });
});

exports.DeleteAll = asyncHandler(async (req, res) => {
  await Product.deleteMany();

  res.status(200).json({ success: true });
});

exports.buyProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOne({
    name: req.body.name,
    size: req.body.size,
    color: req.body.color,
  });

  if (!product) throw new Error("Product not found");

  if (product.count < req.body.count)
    throw new Error("user wanna buy more than have");

  product.count -= req.body.count;

  const cart = await Cart.findOne({ owner: req.body.userId });

  if (cart.products.includes((item) => item === req.body.userId)) {
    cart.products.filter((item) => item !== product._id);

    await cart.save();
  }

  await product.save();

  res.status(200).json({ success: true, data: product });
});

exports.DeleteAll = asyncHandler(async (req, res) => {
  await Product.deleteMany();

  res.status(200).json({ success: true });
});
