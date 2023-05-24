const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const cartSchema = new Schema({
  owner: { type: mongoose.Schema.ObjectId, required: true, ref: "users" },
  products: [
    {
      items: {
        type: mongoose.Schema.ObjectId,
        required: false,
        ref: "products",
      },
      count: {
        type: Number,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  images: {
    type: Array,
    required: true,
  },
});

const Cart = mongoose.model("carts", cartSchema);

module.exports = Cart;
