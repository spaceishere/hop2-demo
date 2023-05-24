const User = require("../model/user.js");
const asyncHandler = require("../middleware/asyncHandler.js");

const jwt = require("jsonwebtoken");

exports.checkUser = asyncHandler(async (req, res) => {
  const token = req.headers.token;

  if (!token) {
    return res.status(404).json({ message: "Invalid token" });
  }

  const data = await jwt.decode(token, process.env.ACCESS_TOKEN_KEY);

  if (!data) throw new Error("Error on decode");

  const user = await User.findById(data?.id)
    .populate({
      path: "cart",
      populate: "products",
    })
    .populate("cart");

  res.status(200).json({ success: true, data: user });
});

exports.getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});

  if (!users) throw new Error("No users found");

  res.status(200).json({ success: true, data: users });
});

exports.getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) throw new Error("No user found");

  res.status(200).json({ success: true, data: user });
});

exports.createUser = asyncHandler(async (req, res) => {
  const checkEmail = await User.findOne({ email: req.body.email });

  if (checkEmail !== null)
    return res.status(200).json({
      success: false,
      message: `${req.body.email} бүртгэлтэй байна`,
    });

  const user = await User.create(req.body);

  // await user.populate({ path: "cart", populate: "products" }).populate("cart");
  const token = user.getJWT("user");

  res.status(200).json({ success: true, data: user, token });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) throw new Error("write your email or password");

  const user = await User.findOne({ email })
    .select("+password")
    .populate({ path: "cart", populate: "products" })
    .populate("cart");

  if (!user) throw new Error("wrong your email or password");

  const isOkey = await user.checkPassword(password);

  if (!isOkey) {
    return res.status(400).json({ message: "password is dont match" });
  }

  delete user.password;

  const token = user.getJWT("user");

  res.status(200).json({ success: true, data: user, token });
});

exports.deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) throw new Error("No user found");

  res.status(200).json({ success: true, data: user });
});

exports.DeleteAll = async (req, res) => {
  await User.deleteMany();

  res.status(200).json({ success: true });
};
