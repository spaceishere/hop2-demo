const jwt = require("jsonwebtoken");

const Artist = require("../model/artist.js");
const asyncHandler = require("../middleware/asyncHandler.js");

exports.checkArtist = asyncHandler(async (req, res) => {
  const token = req.headers.token;

  if (!token) {
    return res.status(404).json({ message: "Invalid token" });
  }

  const data = await jwt.decode(token, process.env.ACCESS_TOKEN_KEY);

  if (!data) throw new Error("Error on decode");

  const artist = await Artist.findById(data?.id).populate({
    path: "products",
  });

  res.status(200).json({ success: true, data: artist });
});

exports.getArtists = asyncHandler(async (req, res) => {
  const { query } = req;

  const artists = await Artist.find(query).populate("products");

  if (!artists) throw new Error("No artists found");

  res.status(200).json({ success: true, data: artists });
});

exports.getArtist = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await Artist.findById(id).populate("products");

  if (!user) throw new Error("No user found");

  res.send({ success: true, data: user });
});

exports.createArtist = asyncHandler(async (req, res) => {
  const checkEmail = await Artist.findOne({ email: req.body.email });

  if (checkEmail !== null)
    return res.status(200).json({
      success: false,
      message: `${req.body.email} бүртгэлтэй байна`,
    });

  const artist = await Artist.create(req.body);

  await artist.populate({ path: "products" });

  const token = artist.getJWT("artist");

  res.status(200).json({ success: true, data: artist, token });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) throw new Error("write your email or password");

  const artist = await Artist.findOne({ email })
    .select("+password")
    .populate({ path: "products" });

  if (!artist) throw new Error("wrong your email or password");

  const isOkey = await artist.checkPassword(password);

  if (!isOkey) {
    return res.status(400).json({ message: "password is dont match" });
  }

  delete artist.password;

  const token = artist.getJWT("artist");

  res.status(200).json({ success: true, data: artist, token });
});

exports.deleteArtist = asyncHandler(async (req, res) => {
  const artist = await Artist.findByIdAndRemove(req.params.id);

  if (!artist) throw new Error("No artist found");

  res.status(200).json({ success: true, data: artist });
});

exports.DeleteAll = asyncHandler(async (req, res) => {
  await Artist.deleteMany();

  res.status(200).json({ success: true });
});
