const mongoose = require("mongoose");
const Schema = require("mongoose");

const categorySchema = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  isCommon: {
    type: Boolean,
    required: true,
    default: false,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
});

const category = new mongoose.model('category', categorySchema);

module.exports = category;