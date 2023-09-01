const express = require("express");
const { auth } = require('../middlewares/auth');
const {
  login,
  register,
  logout,
  loginView,
  updateProfile,
  viewProfile,
  verification,
  addAdmin,
  addAdminView,
  deleteAdmin,
  viewAllAdmins,
  forgetView,
  sendLink,
  changePassword,
  changePasswordView,
} = require("../controllers/user.controller");

const route = express.Router();

route.get('/', loginView);
route.post('/login', login);
route.post('/register', register);
route.get('/logout', logout);
route.get('/profile', auth, viewProfile);
route.post('/profile', auth, updateProfile);
route.get('/verification/:emailID', verification);
route.post('/admin', addAdmin);
route.get('/delete/:id', auth, deleteAdmin);
route.get('/admin', auth, addAdminView);
route.get('/alladmin', auth, viewAllAdmins);
route.get('/forget', forgetView);
route.post('/forget', sendLink);
route.get('/change/:emailID', changePasswordView);
route.post('/change', changePassword);

module.exports = route;
