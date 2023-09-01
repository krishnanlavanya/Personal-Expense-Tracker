const mongoose = require("mongoose");
const Schema = require("mongoose");

const expenseSchema = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  name: {
    type: String,
    trim: true,
    required: true,
  },
  date: {
    type: Date,
    trim: true,
    required: true,
  },
  amount: {
    type: Number,
    trim: true,
    required: true,
  },
  isReimburse: {
    type: String,
    trim: true,
    required: true,
  },
  status: {
    type: String,
    trim: true,
    default: 'Pending'
  },
});

const expense = new mongoose.model('expense', expenseSchema);

module.exports = expense;