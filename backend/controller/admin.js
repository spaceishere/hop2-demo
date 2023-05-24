const jwt = require("jsonwebtoken");

const Admin = require("../model/admin.js");
const asyncHandler = require("../middleware/asyncHandler");

exports.checkAdmin = asyncHandler(async (req, res) => {
  const token = req.headers.token;

  if (!token) {
    return res.status(404).json({ message: "Invalid token" });
  }

  const data = await jwt.decode(token, process.env.ACCESS_TOKEN_KEY);

  if (!data) throw new Error("Error on decode");

  const admin = await Admin.findById(data?.id);

  res.status(200).json({ success: true, data: admin });
});

exports.createAdmin = asyncHandler(async (req, res) => {
  const checkEmail = await Admin.findOne({ email: req.body.email });

  if (checkEmail !== null)
    return res.status(200).json({
      success: false,
      message: `${req.body.email} бүртгэлтэй байна`,
    });

  const admin = await Admin.create({
    email: req.body.email,
    password: req.body.password
  });
  console.log(req.body)

  const token = admin.getJWT();

  res.status(200).json({ success: true, data: admin, token });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) throw new Error("write your email or password");

  const admin = await Admin.findOne({ email }).select("+password");

  if (!admin) throw new Error("wrong your email or password");

  const isOkey = await admin.checkPassword(password);

  if (!isOkey) {
    return res.status(400).json({ message: "password is dont match" });
  }

  delete admin.password;

  const token = admin.getJWT();

  res.status(200).json({ success: true, data: admin, token });
});
