const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Schema = mongoose.Schema;

const artistSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "your email is not email address",
      ],
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    name: {
      type: String,
      required: true,
      minLength: [3, "name at least 3 letter"],
      maxLength: [30, "name max 30 letter"],
    },
    type_of: {
      type: String,
      enum: [
        "Оёдолчин",
        "Гэрэл зурагчин",
        "Зураач",
        "График дизайнер",
        "Гар урлаач",
      ],
    },
    cv: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    backgroundImage: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

artistSchema.pre("save", async function (next) {
  if (!this.isModified("password")) next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

artistSchema.methods.getJWT = function (role) {
  const token = jwt.sign({ id: this._id, role }, process.env.ACCESS_TOKEN_KEY, {
    expiresIn: process.env.JWT_EXPIRESIN,
  });

  return token;
};

artistSchema.methods.checkPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

artistSchema.pre("remove", async function (next) {
  await this.model("products").deleteMany({ owner: this._id });
  next();
});

artistSchema.virtual("products", {
  ref: "products",
  localField: "_id",
  foreignField: "owner",
  justOne: false,
});

const Artist = mongoose.model("artists", artistSchema);

module.exports = Artist;
