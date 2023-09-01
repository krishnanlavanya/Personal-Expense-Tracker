const mongoose = require("mongoose");
const Schema = require("mongoose");

const reminderSchema = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  emailID: {
    type: String,
    required: true,
    trim: true,
  },
  date: {
    type: Date,
    trim: true,
    required: true,
  },
  subject: {
    type: String,
    trim: true,
    required: true,
  },
  body: {
    type: String,
    trim: true,
    required: true,
  },
  interval: {
    type: String,
    trim: true,
    required: true,
  },
});

const reminder = new mongoose.model('reminder', reminderSchema);

module.exports = reminder;