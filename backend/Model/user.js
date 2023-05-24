const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: {
      unique: true,
      type: String,
      required: [true, "write your email"],
    },
    password: {
      type: String,
      required: true,
      minLength: [6, " password bagadaa 8 temdegtees bvrdene"],
      select: false,
    },
    name: {
      type: String,
      required: true,
      minLength: [3, "name at least 3 letter"],
      maxLength: [30, "name max 30 letter"],
    },
    image: {
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

userSchema.virtual("cart", {
  ref: "carts",
  localField: "_id",
  foreignField: "owner",
  justOne: true,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.getJWT = function (role) {
  const token = jwt.sign(
    { id: this._id, role: role },
    process.env.ACCESS_TOKEN_KEY,
    {
      expiresIn: process.env.JWT_EXPIRESIN,
    }
  );

  return token;
};

userSchema.methods.checkPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.pre("save", async function (next) {
  await this.model("carts").create({ owner: this._id });
  next();
});

userSchema.pre("remove", async function (next) {
  await this.model("carts").deleteOne({ owner: this._id });
  next();
});

const User = mongoose.model("users", userSchema);

module.exports = User;
