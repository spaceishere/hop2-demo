const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema({
  size: {
    type: String,
    required: true,
    enum: ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL"],
  },
  color: {
    type: String,
    required: [true, "ongoo ogno vv"],
  },
  count: {
    type: Number,
    required: [true, "too shirhegee ogno vv"],
  },

  name: {
    type: String,
    required: true,
  },
  descriptions: {
    type: [String],
  },
  images: { type: [String] },
  price: {
    type: Number,
    required: [true, "vnee ogno vv"],
  },
  caretip: { type: String, required: true },
  warning: { type: String, required: true },
  type_of: {
    type: "string",
    enum: ["Хувцас", "Гар урлал", "Бусад"],
  },

  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: "artists",
  },
  status: {
    type: String,
    enum: ["pending", "rejected", "approved"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const Product = mongoose.model("products", productSchema);

module.exports = Product;
