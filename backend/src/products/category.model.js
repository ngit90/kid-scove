const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    value: { type: String, required: true },
    image: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", CategorySchema);

module.exports = Category;