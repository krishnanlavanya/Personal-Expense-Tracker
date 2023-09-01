const mongoose = require('mongoose');

require('./src/db/connection');
const category = require('./src/models/category');
const user = require('./src/models/user');

const seedAdmin = [{
  "userName":"Fintrak Admin",
  "emailID":"admin@gmail.com",
  "password":"$2a$10$yomnda.71Pvatb0dxByAjOEs6pMVUBPFHcURqv9L2.ZqfBBZX4h2e",
  "role":"admin",
  "isVerified":true
}];

const seedCategories = [
  {"isCommon":true,"name":"Entertainment"},
  {"isCommon":true,"name":"Food & Beverages"},
  {"isCommon":true,"name":"Mortgage"},
  {"isCommon":true,"name":"Medical"},
  {"isCommon":true,"name":"Education"},
  {"isCommon":true,"name":"Gas & Fuel"},
  {"isCommon":true,"name":"Miscellaneous"},
  {"isCommon":true,"name":"Utilities"},
  {"isCommon":true,"name":"Insurance"},
  {"isCommon":true,"name":"Transportation"},
  {"isCommon":true,"name":"Groceries"},
];

const seedDB = async () => {
  await user.insertMany(seedAdmin);
  await category.deleteMany();
  await category.insertMany(seedCategories);

  console.log('Seeding process completed!!')
};

seedDB().then(() => {
  mongoose.connection.close();
});