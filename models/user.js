const mongoose = require("mongoose");
const Schema = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    trim: true,
  },
  emailID: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'user',
    required: true,
    trim: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  address: {
    type: String,
    default: '',
    trim: true,
  },
  city: {
    type: String,
    default: '',
    trim: true,
  },
  state: {
    type: String,
    default: '',
    trim: true,
  },
  country: {
    type: String,
    default: '',
    trim: true,
  },
  pincode: {
    type: String,
    default: '',
    trim: true,
  },
  companyName: {
    type: String,
    default: '',
    trim: true,
  },
  employeeID: {
    type: String,
    default: '',
    trim: true,
  },

});

userSchema.methods.getToken = function ({ exp, secret }) {
  let token;
  if (exp) {
    token = jwt.sign({ id: this._id }, secret, {
      // This time is in second
      expiresIn: exp,
    });
  } else {
    token = jwt.sign({ id: this._id }, secret);
  }

  return token;
};

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const user = new mongoose.model("user", userSchema);

module.exports = user;
