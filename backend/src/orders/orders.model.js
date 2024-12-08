const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    products: [
      {
        _id: {  type: mongoose.Schema.Types.ObjectId,
          ref: "Products",
          required: true }, 
        quantity: { type: Number, required: true },
      },
    ],
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      email: { type: String, required: true },
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      state: { type: String, required: true },
      phone: { type: String, required: true },
      pincode: { type: String, required: true },
      country: { type: String, required: true },
    },
    amount: Number,
    status: {
      type: String,
      enum: ["confirmed", "processing", "shipped", "completed",],
      default: "confirmed",
    },
  },
  { timestamps: true }
);
const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;